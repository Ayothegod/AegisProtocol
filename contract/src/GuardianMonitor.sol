// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {
    SomniaEventHandler
} from "@somnia-chain/reactivity-contracts/contracts/SomniaEventHandler.sol";
import {
    ReentrancyGuard
} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {PositionRegistry} from "./PositionRegistry.sol";
import {HealthCalculator} from "./HealthCalculator.sol";
import {GuardianEngine} from "./GuardianEngine.sol";

contract GuardianMonitor is SomniaEventHandler, ReentrancyGuard {
    address public owner;

    PositionRegistry public positionRegistry;
    HealthCalculator public healthCalculator;
    GuardianEngine public guardianEngine;

    mapping(uint256 => uint256) public lastHealthFactor;
    mapping(uint256 => bool) public guardianFiredForPosition;

    event GuardianTriggered(
        uint256 indexed positionId,
        address indexed owner,
        uint256 healthFactor
    );

    event HealthStatusUpdated(
        uint256 indexed positionId,
        uint256 newHealthFactor
    );

    event ContractUpdated(string contractName, address newAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        address _positionRegistry,
        address _healthCalculator,
        address _guardianEngine
    ) {
        owner = msg.sender;
        positionRegistry = PositionRegistry(_positionRegistry);
        healthCalculator = HealthCalculator(_healthCalculator);
        guardianEngine = GuardianEngine(_guardianEngine);
    }

    function _onEvent(
        address emitter,
        bytes32[] calldata eventTopics,
        bytes calldata data
    ) internal override nonReentrant {
        // validate emitter
        if (emitter != address(positionRegistry)) return;

        // need at least 2 topics
        if (eventTopics.length < 2) return;

        // decode positionId
        uint256 positionId = uint256(eventTopics[1]);

        // fetch position
        PositionRegistry.Position memory position = positionRegistry
            .getPosition(positionId);

        // must be active
        if (!position.isActive) return;

        // calculate health factor
        uint256 healthFactor = healthCalculator.calculateHealthFactor(
            position.collateral,
            position.debt,
            position.threshold
        );

        // always emit health update
        emit HealthStatusUpdated(positionId, healthFactor);
        lastHealthFactor[positionId] = healthFactor;

        // convert threshold to 1e18 scale
        uint256 thresholdScaled = position.threshold * 1e16;

        // position safe — reset flag
        if (healthFactor >= thresholdScaled) {
            guardianFiredForPosition[positionId] = false;
            return;
        }

        // already fired in this window
        if (guardianFiredForPosition[positionId]) return;

        // checks-effects-interactions
        guardianFiredForPosition[positionId] = true;

        emit GuardianTriggered(positionId, position.owner, healthFactor);

        guardianEngine.execute(positionId);
    }

    function setGuardianEngine(address _guardianEngine) external onlyOwner {
        require(_guardianEngine != address(0), "Zero address");
        guardianEngine = GuardianEngine(_guardianEngine);
        emit ContractUpdated("GuardianEngine", _guardianEngine);
    }

    function setPositionRegistry(address _positionRegistry) external onlyOwner {
        require(_positionRegistry != address(0), "Zero address");
        positionRegistry = PositionRegistry(_positionRegistry);
        emit ContractUpdated("PositionRegistry", _positionRegistry);
    }

    function setHealthCalculator(address _healthCalculator) external onlyOwner {
        require(_healthCalculator != address(0), "Zero address");
        healthCalculator = HealthCalculator(_healthCalculator);
        emit ContractUpdated("HealthCalculator", _healthCalculator);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }

    function resetGuardianFlag(uint256 positionId) external onlyOwner {
        guardianFiredForPosition[positionId] = false;
    }
}

// ── Test helper — REMOVE BEFORE MAINNET ────────────────
function exposed_onEvent(
    address emitter,
    bytes32[] calldata eventTopics,
    bytes calldata data
) external {
    _onEvent(emitter, eventTopics, data);
}
