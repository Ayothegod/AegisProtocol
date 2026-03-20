// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/GuardianMonitor.sol";
import "../src/PositionRegistry.sol";
import "../src/HealthCalculator.sol";
import "../src/GuardianEngine.sol";

contract GuardianMonitorTest is Test {
    GuardianMonitor public monitor;
    PositionRegistry public registry;
    HealthCalculator public calculator;
    GuardianEngine public engine;
    PriceFeed public priceFeed;

    address constant COLLATERAL_TOKEN = address(0x1); // ETH
    address constant DEBT_TOKEN = address(0x3); // USDC
    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");

    // Helper — build eventTopics the same way Somnia would
    function buildTopics(
        bytes32 sig,
        uint256 positionId,
        address posOwner
    ) internal pure returns (bytes32[] memory) {
        bytes32[] memory topics = new bytes32[](3);
        topics[0] = sig;
        topics[1] = bytes32(positionId);
        topics[2] = bytes32(uint256(uint160(posOwner)));
        return topics;
    }

    function setUp() public {
        vm.startPrank(owner);
        priceFeed = new PriceFeed();
        registry = new PositionRegistry();
        calculator = new HealthCalculator(address(priceFeed));
        engine = new GuardianEngine(address(registry), address(calculator));
        monitor = new GuardianMonitor(
            address(registry),
            address(calculator),
            address(engine),
            address(priceFeed) // ← new
        );
        engine.setGuardianMonitor(address(monitor));
        vm.stopPrank();
    }

    // ── Test 1: decodes positionId correctly ───────────────
    function test_DecodesPositionId() public {
        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            1000e18,
            500e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        bytes32[] memory topics = buildTopics(
            keccak256("PositionUpdated(uint256,address)"),
            positionId,
            user1
        );

        // call _onEvent via expose (see note below)
        vm.prank(address(registry));
        monitor.exposed_onEvent(address(registry), topics, "");

        // health factor should be stored
        assertGt(monitor.lastHealthFactor(positionId), 0);
    }

    // ── Test 2: Guardian fires when below threshold ────────
    function test_GuardianFiresWhenBelowThreshold() public {
        vm.prank(user1);
        _makePositionDangerous();

        // collateral 1000, debt 900, threshold 130 → hf = 1.11 → below 1.30
        uint256 positionId = registry.registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        bytes32[] memory topics = buildTopics(
            keccak256("PositionUpdated(uint256,address)"),
            positionId,
            user1
        );

        vm.expectEmit(true, true, false, false);
        emit GuardianMonitor.GuardianTriggered(positionId, user1, 0);

        vm.prank(address(registry));
        monitor.exposed_onEvent(address(registry), topics, "");

        assertTrue(monitor.guardianFiredForPosition(positionId));
    }

    // ── Test 3: Guardian does NOT fire when above threshold ─
    function test_GuardianDoesNotFireWhenSafe() public {
        vm.prank(user1);
        // collateral 1000, debt 400, threshold 130 → hf = 2.5 → safe
        uint256 positionId = registry.registerPosition(
            1000e18,
            400e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        bytes32[] memory topics = buildTopics(
            keccak256("PositionUpdated(uint256,address)"),
            positionId,
            user1
        );

        vm.prank(address(registry));
        monitor.exposed_onEvent(address(registry), topics, "");

        assertFalse(monitor.guardianFiredForPosition(positionId));
    }

    // ── Test 4: Does NOT fire for inactive positions ───────
    function test_DoesNotFireForInactivePosition() public {
        vm.startPrank(user1);
        uint256 positionId = registry.registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        registry.deletePosition(positionId);
        vm.stopPrank();

        bytes32[] memory topics = buildTopics(
            keccak256("PositionUpdated(uint256,address)"),
            positionId,
            user1
        );

        vm.prank(address(registry));
        monitor.exposed_onEvent(address(registry), topics, "");

        assertFalse(monitor.guardianFiredForPosition(positionId));
    }

    // ── Test 5: Duplicate trigger protection ───────────────
    function test_NoDuplicateTrigger() public {
        vm.prank(user1);
        _makePositionDangerous();

        uint256 positionId = registry.registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        bytes32[] memory topics = buildTopics(
            keccak256("PositionUpdated(uint256,address)"),
            positionId,
            user1
        );

        // first call — should fire
        vm.prank(address(registry));
        monitor.exposed_onEvent(address(registry), topics, "");
        assertTrue(monitor.guardianFiredForPosition(positionId));

        // second call — should NOT fire again
        // we check no GuardianTriggered event is emitted
        vm.recordLogs();
        vm.prank(address(registry));
        monitor.exposed_onEvent(address(registry), topics, "");

        Vm.Log[] memory logs = vm.getRecordedLogs();
        // filter for GuardianTriggered — should not exist
        bytes32 sig = keccak256("GuardianTriggered(uint256,address,uint256)");
        for (uint i = 0; i < logs.length; i++) {
            assertTrue(logs[i].topics[0] != sig, "Should not fire twice");
        }
    }

    // ── Test 6: Wrong emitter is ignored ───────────────────
    function test_WrongEmitterIgnored() public {
        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        bytes32[] memory topics = buildTopics(
            keccak256("PositionUpdated(uint256,address)"),
            positionId,
            user1
        );

        // call with wrong emitter — should be ignored
        address wrongEmitter = makeAddr("attacker");
        vm.prank(wrongEmitter);
        monitor.exposed_onEvent(wrongEmitter, topics, "");

        assertFalse(monitor.guardianFiredForPosition(positionId));
    }

    // ── Test 7: Admin functions ────────────────────────────
    function test_AdminCanUpdateContracts() public {
        address newEngine = makeAddr("newEngine");
        vm.prank(owner);
        monitor.setGuardianEngine(newEngine);
        assertEq(address(monitor.guardianEngine()), newEngine);
    }

    function test_NonOwnerCannotUpdateContracts() public {
        vm.prank(user1);
        vm.expectRevert("Not owner");
        monitor.setGuardianEngine(makeAddr("newEngine"));
    }

    // ── Test 8: Flag resets when position recovers ─────────
    function test_FlagResetsWhenPositionRecovers() public {
        vm.startPrank(user1);
        _makePositionDangerous();

        uint256 positionId = registry.registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        vm.stopPrank();

        bytes32[] memory topics = buildTopics(
            keccak256("PositionUpdated(uint256,address)"),
            positionId,
            user1
        );

        // first — trigger Guardian (below threshold)
        vm.prank(address(registry));
        monitor.exposed_onEvent(address(registry), topics, "");
        assertTrue(monitor.guardianFiredForPosition(positionId));

        // position recovers — update to safe health factor
        vm.prank(user1);
        registry.updatePosition(
            positionId,
            3000e18,
            500e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        // call again with recovered position
        vm.prank(address(registry));
        monitor.exposed_onEvent(address(registry), topics, "");

        // flag should be reset
        assertFalse(monitor.guardianFiredForPosition(positionId));
    }

    // add this helper to the test contract
    function _makePositionDangerous() internal {
        // set ETH price to $1 so health factor reflects raw ratio
        vm.prank(owner);
        priceFeed.updatePrice(COLLATERAL_TOKEN, 1e8);
    }

    function _restorePrice() internal {
        vm.prank(owner);
        priceFeed.updatePrice(COLLATERAL_TOKEN, 2000e8);
    }

    // ── New: BlockTick fires Guardian on price drop ────────
    function test_BlockTickFiresOnPriceDrop() public {
        // register a healthy position
        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            1e18,
            1000e18,
            130, // 1 ETH collateral, 1000 USDC debt
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        // confirm healthy at $2000 ETH — hf = 2.0x — above 1.30x
        bytes32[] memory posTopics = buildTopics(
            keccak256("PositionUpdated(uint256,address)"),
            positionId,
            user1
        );
        vm.prank(address(registry));
        monitor.exposed_onEvent(address(registry), posTopics, "");
        assertFalse(monitor.guardianFiredForPosition(positionId));

        // ETH crashes to $1200 — hf = 1.2x — below 1.30x threshold
        vm.prank(owner);
        priceFeed.updatePrice(COLLATERAL_TOKEN, 1200e8);

        // simulate BlockTick firing on block 10 (divisible by checkInterval)
        bytes32[] memory blockTopics = new bytes32[](2);
        blockTopics[0] = keccak256("BlockTick(uint64)");
        blockTopics[1] = bytes32(uint256(10)); // block 10

        monitor.exposed_onEvent(
            address(0x0000000000000000000000000000000000000100),
            blockTopics,
            ""
        );

        // Guardian should have fired due to price drop
        assertTrue(monitor.guardianFiredForPosition(positionId));
    }

    // ── New: BlockTick skips non-interval blocks ───────────
    function test_BlockTickSkipsNonIntervalBlocks() public {
        _makePositionDangerous();

        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        // block 7 — not divisible by checkInterval (10) — should skip
        bytes32[] memory blockTopics = new bytes32[](2);
        blockTopics[0] = keccak256("BlockTick(uint64)");
        blockTopics[1] = bytes32(uint256(7));

        monitor.exposed_onEvent(
            address(0x0000000000000000000000000000000000000100),
            blockTopics,
            ""
        );

        // Guardian should NOT have fired
        assertFalse(monitor.guardianFiredForPosition(positionId));

        _restorePrice();
    }

    // ── New: BlockTick ignores inactive positions ──────────
    function test_BlockTickIgnoresInactivePositions() public {
        _makePositionDangerous();

        vm.startPrank(user1);
        uint256 positionId = registry.registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        registry.deletePosition(positionId);
        vm.stopPrank();

        bytes32[] memory blockTopics = new bytes32[](2);
        blockTopics[0] = keccak256("BlockTick(uint64)");
        blockTopics[1] = bytes32(uint256(10));

        monitor.exposed_onEvent(
            address(0x0000000000000000000000000000000000000100),
            blockTopics,
            ""
        );

        assertFalse(monitor.guardianFiredForPosition(positionId));
        _restorePrice();
    }

    // ── New: admin can update PriceFeed ───────────────────
    function test_AdminCanUpdatePriceFeed() public {
        address newFeed = makeAddr("newFeed");
        vm.prank(owner);
        monitor.setPriceFeed(newFeed);
        assertEq(address(monitor.priceFeed()), newFeed);
    }

    // ── New: admin can update check interval ──────────────
    function test_AdminCanUpdateCheckInterval() public {
        vm.prank(owner);
        monitor.setCheckInterval(20);
        assertEq(monitor.checkInterval(), 20);
    }

    // ── New: non-owner cannot update check interval ───────
    function test_NonOwnerCannotUpdateCheckInterval() public {
        vm.prank(user1);
        vm.expectRevert("Not owner");
        monitor.setCheckInterval(20);
    }
}
