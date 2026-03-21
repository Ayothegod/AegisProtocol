// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {PriceFeed} from "./PriceFeed.sol";

contract HealthCalculator {
    enum HealthStatus {
        SAFE,
        WARNING,
        DANGER
    }
    PriceFeed public priceFeed;

    uint256 public constant PRECISION = 1e18;
    uint256 public constant SAFE_THRESHOLD = 150 * 1e16;
    uint256 public constant WARNING_THRESHOLD = 120 * 1e16;
    uint256 public constant DANGER_THRESHOLD = 110 * 1e16;
    // getHealthStatus uses SAFE_THRESHOLD and WARNING_THRESHOLD, but DANGER_THRESHOLD is never referenced anywhere in the code. Either use it as the boundary for the DANGER enum value, or remove it to avoid confusion about what it's supposed to enforce.

    constructor(address _priceFeed) {
        priceFeed = PriceFeed(_priceFeed);
    }

    function calculateHealthFactor(
        uint256 collateral,
        uint256 debt,
        address collateralToken,
        address debtToken
    ) public view returns (uint256) {
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

    function isLiquidatable(
        uint256 collateral,
        uint256 debt,
        uint256 threshold,
        address collateralToken,
        address debtToken
    ) public view returns (bool) {
        uint256 healthFactor = calculateHealthFactor(
            collateral,
            debt,
            collateralToken,
            debtToken
        );
        uint256 thresholdScaled = threshold * 1e16;
        return healthFactor < thresholdScaled;
    }
}
