// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {PositionRegistry} from "./PositionRegistry.sol";
import {HealthCalculator} from "./HealthCalculator.sol";

/**
 * @title GuardianEngine
 * @dev Executes protective actions when Guardian fires.
 *      Called exclusively by GuardianMonitor.
 *
 *      Three strategies:
 *      ALERT_ONLY → emit alert event
 *      AUTO_TOPUP → increase collateral by X%
 *      AUTO_REPAY → decrease debt by X%
 *
 *      In production, AUTO_TOPUP and AUTO_REPAY would pull
 *      real tokens from the user's approved balance.
 *      For this demo they update the registry directly.
 */
contract GuardianEngine {
    // ── State ──────────────────────────────────────────────
    address public owner;
    address public guardianMonitor;

    PositionRegistry public positionRegistry;
    HealthCalculator public healthCalculator;

    // cooldown prevents spam — min time between Guardian
    // actions on the same position (in seconds)
    uint256 public cooldownPeriod = 60;

    // positionId → timestamp of last Guardian action
    mapping(uint256 => uint256) public lastActionTimestamp;

    // how much collateral to add as % of current (basis points)
    // 1000 = 10%
    uint256 public topupBasisPoints = 1000;

    // how much debt to repay as % of current (basis points)
    // 1000 = 10%
    uint256 public repayBasisPoints = 1000;

    // ── Events ─────────────────────────────────────────────

    event AlertTriggered(
        uint256 indexed positionId,
        address indexed owner,
        uint256 healthFactor
    );

    event TopUpExecuted(
        uint256 indexed positionId,
        address indexed owner,
        uint256 oldCollateral,
        uint256 newCollateral,
        uint256 newHealthFactor
    );

    event RepayExecuted(
        uint256 indexed positionId,
        address indexed owner,
        uint256 oldDebt,
        uint256 newDebt,
        uint256 newHealthFactor
    );

    event ActionSkipped(uint256 indexed positionId, string reason);
    event CooldownUpdated(uint256 newPeriod);
    event ContractUpdated(string name, address newAddress);

    // ── Modifiers ──────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyGuardianMonitor() {
        require(msg.sender == guardianMonitor, "Not Guardian Monitor");
        _;
    }

    // ── Constructor ────────────────────────────────────────

    constructor(address _positionRegistry, address _healthCalculator) {
        owner = msg.sender;
        positionRegistry = PositionRegistry(_positionRegistry);
        healthCalculator = HealthCalculator(_healthCalculator);
    }

    // ── Core Execute ───────────────────────────────────────

    /**
     * @dev Called by GuardianMonitor when a position needs
     *      protection. Routes to the correct strategy.
     *
     *      Checks:
     *      1. Position is still active
     *      2. Health is still below threshold (state may have
     *         changed between monitor detecting and engine executing)
     *      3. Cooldown has passed
     */
    function execute(uint256 positionId) external onlyGuardianMonitor {
        PositionRegistry.Position memory position = positionRegistry
            .getPosition(positionId);

        // ── Check 1: position still active ────────────────
        if (!position.isActive) {
            emit ActionSkipped(positionId, "Position inactive");
            return;
        }

        // ── Check 2: still below threshold ────────────────
        // State may have changed between GuardianMonitor
        // detecting the issue and us executing
        // No point acting if position already recovered
        bool stillAtRisk = healthCalculator.isLiquidatable(
            position.collateral,
            position.debt,
            position.threshold,
            position.collateralToken,
            position.debtToken
        );
        if (!stillAtRisk) {
            emit ActionSkipped(positionId, "Position recovered");
            return;
        }

        // ── Check 3: cooldown ─────────────────────────────
        uint256 lastAction = lastActionTimestamp[positionId];
        if (lastAction != 0 && block.timestamp - lastAction < cooldownPeriod) {
            emit ActionSkipped(positionId, "Cooldown active");
            return;
        }

        // ── Update cooldown timestamp ──────────────────────
        // Do this BEFORE external calls — checks-effects-interactions
        lastActionTimestamp[positionId] = block.timestamp;

        // ── Route to strategy ─────────────────────────────
        if (position.strategy == PositionRegistry.Strategy.ALERT_ONLY) {
            _executeAlert(positionId, position);
        } else if (position.strategy == PositionRegistry.Strategy.AUTO_TOPUP) {
            _executeTopUp(positionId, position);
        } else if (position.strategy == PositionRegistry.Strategy.AUTO_REPAY) {
            _executeRepay(positionId, position);
        }
    }

    // ── Strategy Implementations ───────────────────────────

    /**
     * @dev ALERT_ONLY — emit an alert event
     *      No state changes. Frontend picks this up via
     *      Somnia reactivity and notifies the user.
     */
    function _executeAlert(
        uint256 positionId,
        PositionRegistry.Position memory position
    ) internal {
        uint256 healthFactor = healthCalculator.calculateHealthFactor(
            position.collateral,
            position.debt,
            position.collateralToken,
            position.debtToken
        );

        emit AlertTriggered(positionId, position.owner, healthFactor);
    }

    /**
     * @dev AUTO_TOPUP — add collateral to restore health
     *      Increases collateral by topupBasisPoints% of current value.
     *
     *      In production: pull tokens from user's approved balance
     *      For demo: directly update registry
     */
    function _executeTopUp(
        uint256 positionId,
        PositionRegistry.Position memory position
    ) internal {
        uint256 oldCollateral = position.collateral;

        // calculate top-up amount
        // e.g. 1000 basis points = 10% of current collateral
        uint256 topupAmount = (oldCollateral * topupBasisPoints) / 10000;
        uint256 newCollateral = oldCollateral + topupAmount;

        // update position in registry
        positionRegistry.updatePosition({
            positionId: positionId,
            newCollateral: newCollateral,
            newDebt: position.debt,
            newThreshold: position.threshold,
            newStrategy: position.strategy
        });

        // calculate new health factor for event
        uint256 newHealthFactor = healthCalculator.calculateHealthFactor(
            newCollateral,
            position.debt,
            position.collateralToken,
            position.debtToken
        );

        emit TopUpExecuted(
            positionId,
            position.owner,
            oldCollateral,
            newCollateral,
            newHealthFactor
        );
    }

    /**
     * @dev AUTO_REPAY — repay debt to restore health
     *      Reduces debt by repayBasisPoints% of current value.
     *
     *      In production: pull tokens from user's approved balance
     *      For demo: directly update registry
     */
    function _executeRepay(
        uint256 positionId,
        PositionRegistry.Position memory position
    ) internal {
        uint256 oldDebt = position.debt;

        // calculate repay amount
        // e.g. 1000 basis points = 10% of current debt
        uint256 repayAmount = (oldDebt * repayBasisPoints) / 10000;
        uint256 newDebt = oldDebt - repayAmount;

        // guard against repaying more than the debt
        if (newDebt == 0) newDebt = 1;

        // update position in registry
        positionRegistry.updatePosition({
            positionId: positionId,
            newCollateral: position.collateral,
            newDebt: newDebt,
            newThreshold: position.threshold,
            newStrategy: position.strategy
        });

        // calculate new health factor for event
        uint256 newHealthFactor = healthCalculator.calculateHealthFactor(
            position.collateral,
            newDebt,
            position.collateralToken,
            position.debtToken
        );

        emit RepayExecuted(
            positionId,
            position.owner,
            oldDebt,
            newDebt,
            newHealthFactor
        );
    }

    // ── Admin ──────────────────────────────────────────────

    /**
     * @dev Set the GuardianMonitor address
     *      Must be called after deploying GuardianMonitor
     */
    function setGuardianMonitor(address _monitor) external onlyOwner {
        require(_monitor != address(0), "Zero address");
        guardianMonitor = _monitor;
        emit ContractUpdated("GuardianMonitor", _monitor);
    }

    function setPositionRegistry(address _addr) external onlyOwner {
        require(_addr != address(0), "Zero address");
        positionRegistry = PositionRegistry(_addr);
        emit ContractUpdated("PositionRegistry", _addr);
    }

    function setHealthCalculator(address _addr) external onlyOwner {
        require(_addr != address(0), "Zero address");
        healthCalculator = HealthCalculator(_addr);
        emit ContractUpdated("HealthCalculator", _addr);
    }

    function setCooldownPeriod(uint256 _seconds) external onlyOwner {
        // cooldownPeriod = _seconds;
        // emit ContractUpdated("CooldownPeriod", address(0));
        require(_seconds > 0, "Must be > 0"); // also missing validation
        require(_seconds >= 30, "Minimum 30 seconds");
        cooldownPeriod = _seconds;
        emit CooldownUpdated(_seconds);
    }

    function setTopupBasisPoints(uint256 _bps) external onlyOwner {
        require(_bps > 0 && _bps <= 5000, "Must be 0.01% to 50%");
        topupBasisPoints = _bps;
    }

    function setRepayBasisPoints(uint256 _bps) external onlyOwner {
        require(_bps > 0 && _bps <= 5000, "Must be 0.01% to 50%");
        repayBasisPoints = _bps;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }
}
