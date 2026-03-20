// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/PositionRegistry.sol";

contract PositionRegistryTest is Test {
    PositionRegistry public registry;

    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");

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
            PositionRegistry.Strategy.ALERT_ONLY
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
            PositionRegistry.Strategy.ALERT_ONLY
        );
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.AUTO_TOPUP
        );
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.AUTO_REPAY
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
            PositionRegistry.Strategy.ALERT_ONLY
        );
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            THRESHOLD,
            PositionRegistry.Strategy.AUTO_TOPUP
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
            PositionRegistry.Strategy.ALERT_ONLY
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
            PositionRegistry.Strategy.ALERT_ONLY
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
            PositionRegistry.Strategy.ALERT_ONLY
        );

        vm.prank(user2);
        vm.expectRevert("Not position owner");
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
            PositionRegistry.Strategy.ALERT_ONLY
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
            PositionRegistry.Strategy.ALERT_ONLY
        );
    }

    function test_RevertOnZeroDebt() public {
        vm.prank(user1);
        vm.expectRevert("Debt must be greater than 0");
        registry.registerPosition(
            COLLATERAL,
            0,
            THRESHOLD,
            PositionRegistry.Strategy.ALERT_ONLY
        );
    }

    function test_RevertOnZeroThreshold() public {
        vm.prank(user1);
        vm.expectRevert("Threshold must be greater than 0");
        registry.registerPosition(
            COLLATERAL,
            DEBT,
            0,
            PositionRegistry.Strategy.ALERT_ONLY
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
            PositionRegistry.Strategy.ALERT_ONLY
        );
    }
}
