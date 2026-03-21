// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/GuardianEngine.sol";
import "../src/GuardianMonitor.sol";
import "../src/PositionRegistry.sol";
import "../src/HealthCalculator.sol";
import "../src/PriceFeed.sol";

contract GuardianEngineTest is Test {
    GuardianEngine public engine;
    GuardianMonitor public monitor;
    PositionRegistry public registry;
    HealthCalculator public calculator;
    PriceFeed public priceFeed;

    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");

    // token constants
    address constant COLLATERAL_TOKEN = address(0x1); // ETH
    address constant DEBT_TOKEN = address(0x3); // USDC

    // ── helpers ────────────────────────────────────────────

    /**
     * @dev Set ETH price to $1 so raw collateral/debt ratio
     *      reflects directly as health factor.
     *      Makes test values predictable.
     */
    function _makePriceFlat() internal {
        vm.prank(owner);
        priceFeed.updatePrice(COLLATERAL_TOKEN, 1e8); // $1
    }

    function _restorePrice() internal {
        vm.prank(owner);
        priceFeed.updatePrice(COLLATERAL_TOKEN, 2000e8); // $2000
    }

    /**
     * @dev Register a position with flat prices active
     *      so health factor = collateral / debt directly
     */
    function _registerPosition(
        uint256 collateral,
        uint256 debt,
        uint256 threshold,
        PositionRegistry.Strategy strategy
    ) internal returns (uint256) {
        vm.prank(user1);
        return
            registry.registerPosition(
                collateral,
                debt,
                threshold,
                strategy,
                COLLATERAL_TOKEN,
                DEBT_TOKEN
            );
    }

    /**
     * @dev Simulate GuardianMonitor calling execute()
     */
    function _triggerEngine(uint256 positionId) internal {
        vm.prank(address(monitor));
        engine.execute(positionId);
    }

    // ── setUp ──────────────────────────────────────────────

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
            address(priceFeed)
        );

        // wire up — engine only accepts calls from monitor
        engine.setGuardianMonitor(address(monitor));

        // set a default price so all tests start with known state
        // priceFeed.updatePrice(COLLATERAL_TOKEN, 2000e8); // $2000 ETH
        // priceFeed.updatePrice(DEBT_TOKEN, 1e8);

        // give engine permission to update positions
        // in production this would be a role/approval
        // for tests we prank as engine when needed
        vm.stopPrank();

        // set flat prices for predictable math
        _makePriceFlat();
    }

    // ── Test 1: only GuardianMonitor can call execute ──────
    function test_OnlyMonitorCanExecute() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY
        );

        vm.prank(user1);
        vm.expectRevert("Not Guardian Monitor");
        engine.execute(positionId);
    }

    // ── Test 2: skips inactive position ───────────────────
    function test_SkipsInactivePosition() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY
        );

        vm.prank(user1);
        registry.deletePosition(positionId);

        vm.recordLogs();
        _triggerEngine(positionId);

        // should emit ActionSkipped not AlertTriggered
        Vm.Log[] memory logs = vm.getRecordedLogs();
        bytes32 skippedSig = keccak256("ActionSkipped(uint256,string)");
        bool foundSkipped = false;
        for (uint i = 0; i < logs.length; i++) {
            if (logs[i].topics[0] == skippedSig) foundSkipped = true;
        }
        assertTrue(foundSkipped, "Should emit ActionSkipped");
    }

    // ── Test 3: skips if position recovered ───────────────
    function test_SkipsIfPositionRecovered() public {
        // register position that is healthy
        uint256 positionId = _registerPosition(
            3000e18,
            500e18,
            130, // hf = 6.0x — very safe
            PositionRegistry.Strategy.ALERT_ONLY
        );

        vm.recordLogs();
        _triggerEngine(positionId);

        Vm.Log[] memory logs = vm.getRecordedLogs();
        bytes32 skippedSig = keccak256("ActionSkipped(uint256,string)");
        bool foundSkipped = false;
        for (uint i = 0; i < logs.length; i++) {
            if (logs[i].topics[0] == skippedSig) foundSkipped = true;
        }
        assertTrue(foundSkipped, "Should skip recovered position");
    }

    // ── Test 4: ALERT_ONLY emits AlertTriggered ────────────
    function test_AlertOnlyEmitsAlert() public {
        // hf = 1000/900 = 1.11x — below 1.30x threshold
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY
        );

        vm.expectEmit(true, true, false, false);
        emit GuardianEngine.AlertTriggered(positionId, user1, 0);

        _triggerEngine(positionId);
    }

    // ── Test 5: ALERT_ONLY does not change position ────────
    function test_AlertOnlyDoesNotChangePosition() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY
        );

        PositionRegistry.Position memory positionBefore = registry.getPosition(
            positionId
        );

        _triggerEngine(positionId);

        PositionRegistry.Position memory positionAfter = registry.getPosition(
            positionId
        );

        // nothing should change
        assertEq(positionAfter.collateral, positionBefore.collateral);
        assertEq(positionAfter.debt, positionBefore.debt);
    }

    // ── Test 6: AUTO_TOPUP increases collateral ────────────
    function test_AutoTopupIncreasesCollateral() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_TOPUP
        );

        PositionRegistry.Position memory positionBefore = registry.getPosition(
            positionId
        );

        _triggerEngine(positionId);

        PositionRegistry.Position memory positionAfter = registry.getPosition(
            positionId
        );

        // collateral should be higher
        assertGt(positionAfter.collateral, positionBefore.collateral);
        // debt should be unchanged
        assertEq(positionAfter.debt, positionBefore.debt);
    }

    // ── Test 7: AUTO_TOPUP increases by correct amount ─────
    function test_AutoTopupCorrectAmount() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_TOPUP
        );

        _triggerEngine(positionId);

        PositionRegistry.Position memory positionAfter = registry.getPosition(
            positionId
        );

        // default topupBasisPoints = 1000 = 10%
        // 1000e18 + 10% = 1100e18
        assertEq(positionAfter.collateral, 1100e18);
    }

    // ── Test 8: AUTO_TOPUP emits TopUpExecuted ─────────────
    function test_AutoTopupEmitsEvent() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_TOPUP
        );

        vm.expectEmit(true, true, false, false);
        emit GuardianEngine.TopUpExecuted(positionId, user1, 0, 0, 0);

        _triggerEngine(positionId);
    }

    // ── Test 9: AUTO_REPAY reduces debt ───────────────────
    function test_AutoRepayReducesDebt() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_REPAY
        );

        PositionRegistry.Position memory positionBefore = registry.getPosition(
            positionId
        );

        _triggerEngine(positionId);

        PositionRegistry.Position memory positionAfter = registry.getPosition(
            positionId
        );

        // debt should be lower
        assertLt(positionAfter.debt, positionBefore.debt);
        // collateral should be unchanged
        assertEq(positionAfter.collateral, positionBefore.collateral);
    }

    // ── Test 10: AUTO_REPAY reduces by correct amount ──────
    function test_AutoRepayCorrectAmount() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_REPAY
        );

        _triggerEngine(positionId);

        PositionRegistry.Position memory positionAfter = registry.getPosition(
            positionId
        );

        // default repayBasisPoints = 1000 = 10%
        // 900e18 - 10% = 810e18
        assertEq(positionAfter.debt, 810e18);
    }

    // ── Test 11: AUTO_REPAY emits RepayExecuted ────────────
    function test_AutoRepayEmitsEvent() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_REPAY
        );

        vm.expectEmit(true, true, false, false);
        emit GuardianEngine.RepayExecuted(positionId, user1, 0, 0, 0);

        _triggerEngine(positionId);
    }

    // ── Test 12: cooldown blocks second execution ──────────
    function test_CooldownBlocksSecondExecution() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY
        );

        // first execution — should work
        _triggerEngine(positionId);

        // second execution immediately — cooldown active
        vm.recordLogs();
        _triggerEngine(positionId);

        Vm.Log[] memory logs = vm.getRecordedLogs();
        bytes32 skippedSig = keccak256("ActionSkipped(uint256,string)");
        bool foundSkipped = false;
        for (uint i = 0; i < logs.length; i++) {
            if (logs[i].topics[0] == skippedSig) foundSkipped = true;
        }
        assertTrue(foundSkipped, "Cooldown should block second execution");
    }

    // ── Test 13: cooldown expires positionAfter period ─────────────
    function test_CooldownExpiresAfterPeriod() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.ALERT_ONLY
        );

        // first execution
        _triggerEngine(positionId);

        // warp forward past cooldown period (default 60s)
        vm.warp(block.timestamp + 61);

        // second execution — should work now
        vm.expectEmit(true, false, false, false);
        emit GuardianEngine.AlertTriggered(positionId, user1, 0);

        _triggerEngine(positionId);
    }

    // ── Test 14: topup improves health factor ──────────────
    function test_TopupImprovesHealthFactor() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_TOPUP
        );

        PositionRegistry.Position memory positionBefore = registry.getPosition(
            positionId
        );

        uint256 hfBefore = calculator.calculateHealthFactor(
            positionBefore.collateral,
            positionBefore.debt,
            positionBefore.collateralToken,
            positionBefore.debtToken
        );

        _triggerEngine(positionId);

        PositionRegistry.Position memory positionAfter = registry.getPosition(
            positionId
        );

        uint256 hfAfter = calculator.calculateHealthFactor(
            positionAfter.collateral,
            positionAfter.debt,
            positionAfter.collateralToken,
            positionAfter.debtToken
        );

        assertGt(hfAfter, hfBefore);
    }

    // ── Test 15: repay improves health factor ──────────────
    function test_RepayImprovesHealthFactor() public {
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_REPAY
        );

        PositionRegistry.Position memory positionBefore = registry.getPosition(
            positionId
        );

        uint256 hfBefore = calculator.calculateHealthFactor(
            positionBefore.collateral,
            positionBefore.debt,
            positionBefore.collateralToken,
            positionBefore.debtToken
        );

        _triggerEngine(positionId);

        PositionRegistry.Position memory positionAfter = registry.getPosition(
            positionId
        );

        uint256 hfAfter = calculator.calculateHealthFactor(
            positionAfter.collateral,
            positionAfter.debt,
            positionAfter.collateralToken,
            positionAfter.debtToken
        );

        assertGt(hfAfter, hfBefore);
    }

    // ── Test 16: admin can update cooldown ─────────────────
    function test_AdminCanUpdateCooldown() public {
        vm.prank(owner);
        engine.setCooldownPeriod(120);
        assertEq(engine.cooldownPeriod(), 120);
    }

    // ── Test 17: admin can update topup basis points ───────
    function test_AdminCanUpdateTopupBasisPoints() public {
        vm.prank(owner);
        engine.setTopupBasisPoints(2000); // 20%
        assertEq(engine.topupBasisPoints(), 2000);
    }

    // ── Test 18: admin can update repay basis points ───────
    function test_AdminCanUpdateRepayBasisPoints() public {
        vm.prank(owner);
        engine.setRepayBasisPoints(500); // 5%
        assertEq(engine.repayBasisPoints(), 500);
    }

    // ── Test 19: rejects invalid basis points ─────────────
    function test_RejectsInvalidBasisPoints() public {
        vm.startPrank(owner);
        vm.expectRevert("Must be 0.01% to 50%");
        engine.setTopupBasisPoints(0);

        vm.expectRevert("Must be 0.01% to 50%");
        engine.setTopupBasisPoints(5001); // over 50%
        vm.stopPrank();
    }

    // ── Test 20: non-owner cannot update settings ──────────
    function test_NonOwnerCannotUpdateSettings() public {
        vm.startPrank(user1);

        vm.expectRevert("Not owner");
        engine.setCooldownPeriod(120);

        vm.expectRevert("Not owner");
        engine.setTopupBasisPoints(2000);

        vm.expectRevert("Not owner");
        engine.setRepayBasisPoints(500);

        vm.expectRevert("Not Guardian Monitor");
        engine.execute(0);

        vm.stopPrank();
    }

    // ── Test 21: custom topup amount works correctly ───────
    function test_CustomTopupAmount() public {
        // set topup to 20%
        vm.prank(owner);
        engine.setTopupBasisPoints(2000);

        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_TOPUP
        );

        _triggerEngine(positionId);

        PositionRegistry.Position memory positionAfter = registry.getPosition(
            positionId
        );

        // 1000e18 + 20% = 1200e18
        assertEq(positionAfter.collateral, 1200e18);
    }

    // ── Test 22: custom repay amount works correctly ───────
    function test_CustomRepayAmount() public {
        // set repay to 20%
        vm.prank(owner);
        engine.setRepayBasisPoints(2000);

        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_REPAY
        );

        _triggerEngine(positionId);

        PositionRegistry.Position memory positionAfter = registry.getPosition(
            positionId
        );

        // 900e18 - 20% = 720e18
        assertEq(positionAfter.debt, 720e18);
    }

    // ── Test 23: full end to end flow ─────────────────────
    function test_EndToEndFlow() public {
        // 1. Register position below threshold
        uint256 positionId = _registerPosition(
            1000e18,
            900e18,
            130,
            PositionRegistry.Strategy.AUTO_REPAY
        );

        // 2. Confirm below threshold
        PositionRegistry.Position memory initial = registry.getPosition(
            positionId
        );
        assertTrue(
            calculator.isLiquidatable(
                initial.collateral,
                initial.debt,
                initial.collateralToken,
                initial.debtToken
            )
        );

        // 3. Engine executes — repays 10% debt
        _triggerEngine(positionId);

        // 4. Debt reduced
        PositionRegistry.Position memory positionAfter = registry.getPosition(
            positionId
        );
        assertEq(positionAfter.debt, 810e18);

        // 5. Health factor improved
        assertGt(
            calculator.calculateHealthFactor(
                positionAfter.collateral,
                positionAfter.debt,
                positionAfter.collateralToken,
                positionAfter.debtToken
            ),
            calculator.calculateHealthFactor(
                initial.collateral,
                initial.debt,
                initial.collateralToken,
                initial.debtToken
            )
        );
    }

    // ── Test 24: ownership transfer ───────────────────────
    function test_OwnershipTransfer() public {
        vm.prank(owner);
        engine.transferOwnership(user1);
        assertEq(engine.owner(), user1);
    }

    function test_RejectsZeroAddressOwnership() public {
        vm.prank(owner);
        vm.expectRevert("Zero address");
        engine.transferOwnership(address(0));
    }
}
