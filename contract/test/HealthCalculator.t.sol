// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/HealthCalculator.sol";
import "../src/PositionRegistry.sol";
import "../src/PriceFeed.sol";

contract HealthCalculatorTest is Test {
    PriceFeed public priceFeed;
    HealthCalculator public calculator;

    address constant COLLATERAL_TOKEN = address(0x1); // ETH  — $2000
    address constant DEBT_TOKEN = address(0x3); // USDC — $1

    function setUp() public {
        priceFeed = new PriceFeed();
        calculator = new HealthCalculator(address(priceFeed));

        priceFeed.updatePrice(COLLATERAL_TOKEN, 2000e8);
        priceFeed.updatePrice(DEBT_TOKEN, 1e8);
    }

    function test_CalculatesHealthFactorCorrectly() public view {
        uint256 hf = calculator.calculateHealthFactor(
            10000,
            6000,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        assertGt(hf, 0);

        uint256 collateralUSD = 10000 * priceFeed.getPrice(COLLATERAL_TOKEN);
        uint256 debtUSD = 6000 * priceFeed.getPrice(DEBT_TOKEN);
        uint256 expected = (collateralUSD * 1e18) / debtUSD;
        assertEq(hf, expected);
    }

    function test_ReturnsSafeWhenCollateralIsHigh() public view {
        uint256 hf = calculator.calculateHealthFactor(
            10000,
            3000,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        assertEq(
            uint(calculator.getHealthStatus(hf)),
            uint(HealthCalculator.HealthStatus.SAFE)
        );
    }

    function test_ReturnsWarningWhenCollateralIsMedium() public {
        priceFeed.updatePrice(COLLATERAL_TOKEN, 1e8); // $1 temporarily
        uint256 hf = calculator.calculateHealthFactor(
            13000,
            10000,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        assertEq(
            uint(calculator.getHealthStatus(hf)),
            uint(HealthCalculator.HealthStatus.WARNING)
        );
        // priceFeed.updatePrice(COLLATERAL_TOKEN, 2000e8);
    }

    function test_ReturnsDangerWhenCollateralIsLow() public {
        priceFeed.updatePrice(COLLATERAL_TOKEN, 1e8); // $1 temporarily
        uint256 hf = calculator.calculateHealthFactor(
            10000,
            10000,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
        assertEq(
            uint(calculator.getHealthStatus(hf)),
            uint(HealthCalculator.HealthStatus.DANGER)
        );
        // priceFeed.updatePrice(COLLATERAL_TOKEN, 2000e8);
    }

    function test_IsLiquidatableWhenBelowThreshold() public {
        priceFeed.updatePrice(COLLATERAL_TOKEN, 1e8); // $1 — low price
        PositionRegistry.Position memory position = PositionRegistry.Position({
            owner: address(this),
            collateral: 10000,
            debt: 9500,
            threshold: 120,
            strategy: PositionRegistry.Strategy.ALERT_ONLY,
            isActive: true,
            createdAt: block.timestamp,
            collateralToken: COLLATERAL_TOKEN,
            debtToken: DEBT_TOKEN
        });
        assertTrue(
            calculator.isLiquidatable(
                position.collateral,
                position.debt,
                position.threshold,
                position.collateralToken,
                position.debtToken
            )
        );
        // priceFeed.updatePrice(COLLATERAL_TOKEN, 2000e8);
    }

    function test_IsNotLiquidatableWhenAboveThreshold() public view {
        PositionRegistry.Position memory position = PositionRegistry.Position({
            owner: address(this),
            collateral: 10000,
            debt: 3000,
            threshold: 120,
            strategy: PositionRegistry.Strategy.ALERT_ONLY,
            isActive: true,
            createdAt: block.timestamp,
            collateralToken: COLLATERAL_TOKEN,
            debtToken: DEBT_TOKEN
        });
        assertFalse(
            calculator.isLiquidatable(
                position.collateral,
                position.debt,
                position.threshold,
                position.collateralToken,
                position.debtToken
            )
        );
    }

    function test_RevertsWhenDebtIsZero() public {
        vm.expectRevert("Debt cannot be zero");
        calculator.calculateHealthFactor(
            10000,
            0,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );
    }

    function test_PriceDropReducesHealthFactor() public {
        uint256 hfBefore = calculator.calculateHealthFactor(
            1e18,
            1000e18,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        priceFeed.updatePrice(COLLATERAL_TOKEN, 1200e8);

        uint256 hfAfter = calculator.calculateHealthFactor(
            1e18,
            1000e18,
            COLLATERAL_TOKEN,
            DEBT_TOKEN
        );

        assertGt(hfBefore, hfAfter);

        // priceFeed.updatePrice(COLLATERAL_TOKEN, 2000e8);
    }

    function test_SameTokenBothSidesIsPureRatio() public view {
        uint256 hf = calculator.calculateHealthFactor(
            2000,
            1000,
            COLLATERAL_TOKEN,
            COLLATERAL_TOKEN // same token
        );
        assertEq(hf, 2e18);
    }

    function test_RevertsWhenPriceNotSet() public {
        address unknownToken = address(0x99);
        vm.expectRevert("Price not set");
        calculator.calculateHealthFactor(1000, 500, unknownToken, DEBT_TOKEN);
    }
}
