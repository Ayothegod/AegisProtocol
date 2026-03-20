// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./PositionRegistry.sol";

contract HealthCalculator {
    uint256 public constant PRECISION = 1e18;

    enum HealthStatus {
        SAFE,
        WARNING,
        DANGER
    }

    // 150 * 1e18 = 1.5x collateral to debt = SAFE
    // 120 * 1e18 = 1.2x = WARNING
    // 110 * 1e18 = 1.1x = DANGER
    uint256 public constant SAFE_THRESHOLD = 150 * 1e18;
    uint256 public constant WARNING_THRESHOLD = 120 * 1e18;
    uint256 public constant DANGER_THRESHOLD = 110 * 1e18;

    function calculateHealthFactor(
        uint256 collateral,
        uint256 debt,
        uint256 liquidationThreshold
    ) public pure returns (uint256) {
        require(debt > 0, "Debt cannot be zero");

        // (collateral * liquidationThreshold * PRECISION) / debt
        return (collateral * liquidationThreshold * PRECISION) / debt;
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
        PositionRegistry.Position memory position,
        uint256 liquidationThreshold
    ) public pure returns (bool) {
        uint256 healthFactor = calculateHealthFactor(
            position.collateral,
            position.debt,
            liquidationThreshold
        );

        return healthFactor <= DANGER_THRESHOLD;
    }
}
