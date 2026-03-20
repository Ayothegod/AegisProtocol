// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./PositionRegistry.sol";
import {PriceFeed} from "./PriceFeed.sol"

contract HealthCalculator {
    uint256 public constant PRECISION = 1e18;

    enum HealthStatus {
        SAFE,
        WARNING,
        DANGER
    }

    uint256 public constant SAFE_THRESHOLD = 150 * 1e16;
    uint256 public constant WARNING_THRESHOLD = 120 * 1e16
    uint256 public constant DANGER_THRESHOLD = 110 * 1e16


    constructor(address _priceFeed) {
        priceFeed = PriceFeed(_priceFeed);
    }

    function calculateHealthFactor(
        uint256 collateral,
        uint256 debt,
        uint256 liquidationThreshold,
        address collateralToken,
        address debtToken
    ) public pure returns (uint256) {
        require(debt > 0, "Debt cannot be zero");

        uint256 collateralPrice = priceFeed.getPrice(collateralToken);
        uint256 debtPrice = priceFeed.getPrice(debtToken);

        uint256 collateralValueUSD = collateral * collateralPrice;
        uint256 debtValueUSD = debt * debtPrice;

        return (collateralValueUSD * PRECISION) / debtValueUSD;
    }

    function getHealthStatus(
        uint256 healthFactor
    ) public pure returns (HealthStatus) {
        if (healthFactor >= SAFE_THRESHOLD) {
            return HealthStatus.SAFE;
        } else if (healthFactor >= WARNING_THRESHOLD) {
            return HealthStatus.WARNING;
        } else {
            return HealthStatus.DANGER;
        }
    }

    // function isLiquidatable(
    //     PositionRegistry.Position memory position,
    //     uint256 liquidationThreshold
    // ) public pure returns (bool) {
    //     uint256 healthFactor = calculateHealthFactor(
    //         position.collateral,
    //         position.debt,
    //         liquidationThreshold
    //     );

    //     return healthFactor <= DANGER_THRESHOLD;
    // }

    function isLiquidatable(
        uint256 collateral,
        uint256 debt,
        uint256 threshold,
        address collateralToken,
        address debtToken
    ) public view returns (bool) {
        uint256 healthFactor = calculateHealthFactor(
            collateral, debt, threshold,
            collateralToken, debtToken
        );
        uint256 thresholdScaled = threshold * 1e16;
        return healthFactor < thresholdScaled;
    }
}
