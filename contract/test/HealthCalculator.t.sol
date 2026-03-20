// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/HealthCalculator.sol";
import "../src/PositionRegistry.sol";

contract HealthCalculatorTest is Test {
    HealthCalculator public calculator;

    uint256 constant LT = 80;

    function setUp() public {
        calculator = new HealthCalculator();
    }

    function test_CalculatesHealthFactorCorrectly() public view {
        uint256 hf = calculator.calculateHealthFactor(10000, 6000, LT);
        assertEq(hf, uint256(10000 * 80 * 1e18) / 6000);
    }

    function test_ReturnsSafeWhenCollateralIsHigh() public view {
        uint256 hf = calculator.calculateHealthFactor(10000, 3000, LT);
        assertEq(
            uint(calculator.getHealthStatus(hf)),
            uint(HealthCalculator.HealthStatus.SAFE)
        );
    }

    function test_ReturnsWarningWhenCollateralIsMedium() public view {
        uint256 hf = calculator.calculateHealthFactor(10000, 6000, LT);
        assertEq(
            uint(calculator.getHealthStatus(hf)),
            uint(HealthCalculator.HealthStatus.WARNING)
        );
    }

    function test_ReturnsDangerWhenCollateralIsLow() public view {
        uint256 hf = calculator.calculateHealthFactor(10000, 8000, LT);
        assertEq(
            uint(calculator.getHealthStatus(hf)),
            uint(HealthCalculator.HealthStatus.DANGER)
        );
    }

    function test_IsLiquidatableWhenBelowThreshold() public view {
        PositionRegistry.Position memory position = PositionRegistry.Position({
            owner: address(this),
            collateral: 10000,
            debt: 8000,
            threshold: 120,
            strategy: PositionRegistry.Strategy.ALERT_ONLY,
            isActive: true,
            createdAt: block.timestamp
        });

        assertTrue(calculator.isLiquidatable(position, LT));
    }

    function test_IsNotLiquidatableWhenAboveThreshold() public view {
        PositionRegistry.Position memory position = PositionRegistry.Position({
            owner: address(this),
            collateral: 10000,
            debt: 3000,
            threshold: 120,
            strategy: PositionRegistry.Strategy.ALERT_ONLY,
            isActive: true,
            createdAt: block.timestamp
        });

        assertFalse(calculator.isLiquidatable(position, LT));
    }

    function test_RevertsWhenDebtIsZero() public {
        vm.expectRevert("Debt cannot be zero");
        calculator.calculateHealthFactor(10000, 0, LT);
    }
}
