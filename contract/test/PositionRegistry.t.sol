// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/PositionRegistry.sol";

contract PositionRegistryTest is Test {
    PositionRegistry public registry;

    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    address constant COLLATERAL_TOKEN = address(0x1); // ETH
    address constant DEBT_TOKEN = address(0x3); // USDC

    uint256 constant COLLATERAL = 1000e18;
    uint256 constant DEBT = 500e18;
    uint256 constant THRESHOLD = 150;

    function setUp() public {
        registry = new PositionRegistry();
    }

    function test_RegisterPosition() public {
        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        PositionRegistry.Position memory position = registry.getPosition(
            positionId
        );
        assertEq(position.owner, user1);
        assertEq(position.collateral, COLLATERAL);
        assertEq(position.debt, DEBT);
        assertEq(position.threshold, THRESHOLD);
        assertEq(position.isActive, true);
        assertEq(
            uint256(position.strategy),
            uint256(PositionRegistry.Strategy.ALERT_ONLY)
        );
    }

    function test_PositionCountIncrements() public {
        vm.startPrank(user1);
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.AUTO_TOPUP,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.AUTO_REPAY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        vm.stopPrank();

        assertEq(registry.positionCount(), 3);
    }

    function test_OwnerPositionsTracked() public {
        vm.startPrank(user1);
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.AUTO_TOPUP,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        vm.stopPrank();

        uint256[] memory user1Positions = registry.getOwnerPositions(user1);
        assertEq(user1Positions.length, 2);
    }

    function test_UpdatePosition() public {
        vm.startPrank(user1);
        uint256 positionId = registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        registry.updatePosition(
            positionId,
            2000e18,
            800e18,
            200,
            PositionRegistry.Strategy.AUTO_REPAY
        );
        vm.stopPrank();

        PositionRegistry.Position memory position = registry.getPosition(
            positionId
        );
        assertEq(position.collateral, 2000e18);
        assertEq(position.debt, 800e18);
        assertEq(position.threshold, 200);
        assertEq(
            uint256(position.strategy),
            uint256(PositionRegistry.Strategy.AUTO_REPAY)
        );
    }

    function test_DeletePosition() public {
        vm.startPrank(user1);
        uint256 positionId = registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        registry.deletePosition(positionId);
        vm.stopPrank();

        PositionRegistry.Position memory position = registry.getPosition(
            positionId
        );
        assertEq(position.isActive, false);
    }

    function test_OnlyOwnerCanUpdate() public {
        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        vm.prank(user2);
        vm.expectRevert("Not authorized");
        registry.updatePosition(
            positionId,
            2000e18,
            800e18,
            200,
            PositionRegistry.Strategy.AUTO_REPAY
        );
    }

    function test_OnlyOwnerCanDelete() public {
        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        vm.prank(user2);
        vm.expectRevert("Not position owner");
        registry.deletePosition(positionId);
    }

    function test_RevertOnZeroCollateral() public {
        vm.prank(user1);
        vm.expectRevert("Collateral must be greater than 0");
        registry.registerPosition(
            0,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
    }

    function test_RevertOnZeroDebt() public {
        vm.prank(user1);
        vm.expectRevert("Debt must be greater than 0");
        registry.registerPosition(
            COLLATERAL,
            0,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
    }

    function test_RevertOnZeroThreshold() public {
        vm.prank(user1);
        vm.expectRevert("Threshold must be greater than 0");
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            0,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
    }

    function test_EmitsRegisteredEvent() public {
        vm.prank(user1);
        vm.expectEmit(true, true, false, false);
        emit PositionRegistry.PositionRegistered(0, user1);
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
    }

    // ── Test: token addresses stored correctly ─────────────
    function test_TokenAddressesStoredCorrectly() public {
        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        PositionRegistry.Position memory position = registry.getPosition(
            positionId
        );
        assertEq(position.collateralToken, COLLATERAL_TOKEN);
        assertEq(position.debtToken, DEBT_TOKEN);
    }

    // ── Test: reverts on zero collateral token ─────────────
    function test_RevertOnZeroCollateralToken() public {
        vm.prank(user1);
        vm.expectRevert("Invalid collateral token");
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            address(0), // zero address — should revert
            DEBT_TOKEN
        );
    }

    // ── Test: reverts on zero debt token ──────────────────
    function test_RevertOnZeroDebtToken() public {
        vm.prank(user1);
        vm.expectRevert("Invalid debt token");
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            address(0) // zero address — should revert
        );
    }

    // ── Test: authorized updater can update position ───────
    function test_AuthorizedUpdaterCanUpdate() public {
        address engine = makeAddr("engine");

        // grant authorization
        registry.setAuthorizedUpdater(engine, true);

        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        // engine updates on behalf of user — should work
        vm.prank(engine);
        registry.updatePosition(
            positionId,
            2000e18,
            800e18,
            200,
            PositionRegistry.Strategy.AUTO_REPAY
        );

        PositionRegistry.Position memory position = registry.getPosition(
            positionId
        );
        assertEq(position.collateral, 2000e18);
    }

    // ── Test: unauthorized address cannot update ───────────
    function test_UnauthorizedCannotUpdate() public {
        address rando = makeAddr("rando");

        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        vm.prank(rando);
        vm.expectRevert("Not authorized");
        registry.updatePosition(
            positionId,
            2000e18,
            800e18,
            200,
            PositionRegistry.Strategy.AUTO_REPAY
        );
    }

    // ── Test: only contract owner can set authorized updater
    function test_OnlyContractOwnerCanSetAuthorizedUpdater() public {
        vm.prank(user1);
        vm.expectRevert("Not contract owner");
        registry.setAuthorizedUpdater(makeAddr("engine"), true);
    }

    // ── Test: can revoke authorization ─────────────────────
    function test_CanRevokeAuthorization() public {
        address engine = makeAddr("engine");
        registry.setAuthorizedUpdater(engine, true);
        registry.setAuthorizedUpdater(engine, false); // revoke

        vm.prank(user1);
        uint256 positionId = registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        vm.prank(engine);
        vm.expectRevert("Not authorized");
        registry.updatePosition(
            positionId,
            2000e18,
            800e18,
            200,
            PositionRegistry.Strategy.AUTO_REPAY
        );
    }
}
