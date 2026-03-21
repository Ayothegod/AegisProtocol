// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {
    SomniaEventHandler
} from "@somnia-chain/reactivity-contracts/contracts/SomniaEventHandler.sol";
import {PositionRegistry} from "./PositionRegistry.sol";
import {HealthCalculator} from "./HealthCalculator.sol";
import {GuardianEngine} from "./GuardianEngine.sol";
import {PriceFeed} from "./PriceFeed.sol";

contract GuardianMonitor is SomniaEventHandler {
    address public constant SOMNIA_REACTIVITY_PRECOMPILE =
        0x0000000000000000000000000000000000000100;
    bytes32 public constant BLOCK_TICK_SELECTOR =
        keccak256("BlockTick(uint64)");
    bytes32 public constant POSITION_REGISTERED_SELECTOR =
        keccak256("PositionRegistered(uint256,address)");
    bytes32 public constant POSITION_UPDATED_SELECTOR =
        keccak256("PositionUpdated(uint256,address)");

    uint64 public checkInterval = 10;
    address public owner;

    PositionRegistry public positionRegistry;
    HealthCalculator public healthCalculator;
    GuardianEngine public guardianEngine;

    PriceFeed public priceFeed;
    // GuardianMonitor stores and exposes priceFeed, and there's a setPriceFeed admin function for it — but the monitor itself never calls priceFeed anywhere. Price reads happen inside HealthCalculator, not the monitor. This is dead state — either remove it or document why it's there (perhaps intended for future direct price checks).

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
    event BlockTickCheck(uint64 blockNumber, uint256 positionsChecked);
    event ContractUpdated(string contractName, address newAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        address _positionRegistry,
        address _healthCalculator,
        address _guardianEngine,
        address _priceFeed
    ) {
        owner = msg.sender;
        positionRegistry = PositionRegistry(_positionRegistry);
        healthCalculator = HealthCalculator(_healthCalculator);
        guardianEngine = GuardianEngine(_guardianEngine);
        priceFeed = PriceFeed(_priceFeed);
    }

    function _onEvent(
        address emitter,
        bytes32[] calldata eventTopics,
        bytes calldata
    ) internal override {
        // ............... Path 1: PositionRegistry event ....................
        if (emitter == address(positionRegistry)) {
            if (eventTopics.length < 2) return;

            uint256 positionId = uint256(eventTopics[1]);
            _checkPosition(positionId);
            return;
        }

        // ............. Path 2: BlockTick system event ....................
        if (emitter == SOMNIA_REACTIVITY_PRECOMPILE) {
            if (
                eventTopics.length > 0 && eventTopics[0] == BLOCK_TICK_SELECTOR
            ) {
                _handleBlockTick(eventTopics);
            }
            return;
        }
    }

    function _handleBlockTick(bytes32[] calldata eventTopics) internal {
        if (eventTopics.length < 2) return;

        uint64 blockNumber = uint64(uint256(eventTopics[1]));

        // only check every N blocks to manage gas costs
        if (blockNumber % checkInterval != 0) return;

        // check all active positions
        uint256 total = positionRegistry.positionCount();
        uint256 checked = 0;

        for (uint256 i = 0; i < total; i++) {
            PositionRegistry.Position memory position = positionRegistry
                .getPosition(i);

            if (!position.isActive) continue;

            _checkPosition(i);
            checked++;
        }

        emit BlockTickCheck(blockNumber, checked);
    }

    function _checkPosition(uint256 positionId) internal {
        PositionRegistry.Position memory position = positionRegistry
            .getPosition(positionId);

        if (!position.isActive) return;

        uint256 healthFactor = healthCalculator.calculateHealthFactor(
            position.collateral,
            position.debt,
            position.collateralToken,
            position.debtToken
        );

        // always emit health update for frontend
        emit HealthStatusUpdated(positionId, healthFactor);
        lastHealthFactor[positionId] = healthFactor;

        uint256 thresholdScaled = position.threshold * 1e16;

        // position is safe — reset flag so Guardian can
        // fire again if it drops below threshold in future
        if (healthFactor >= thresholdScaled) {
            guardianFiredForPosition[positionId] = false;
            return;
        }

        // already fired in this at-risk window
        if (guardianFiredForPosition[positionId]) return;

        guardianFiredForPosition[positionId] = true;
        emit GuardianTriggered(positionId, position.owner, healthFactor);

        guardianEngine.execute(positionId);
    }

    function setCheckInterval(uint64 _interval) external onlyOwner {
        require(_interval > 0, "Interval must be > 0");
        checkInterval = _interval;
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

    function setPriceFeed(address _priceFeed) external onlyOwner {
        require(_priceFeed != address(0), "Zero address");
        priceFeed = PriceFeed(_priceFeed);
        emit ContractUpdated("PriceFeed", _priceFeed);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }

    function resetGuardianFlag(uint256 positionId) external onlyOwner {
        guardianFiredForPosition[positionId] = false;
    }

    // ── Test helper — REMOVE BEFORE MAINNET ────────────────
    function exposed_onEvent(
        address emitter,
        bytes32[] calldata eventTopics,
        bytes calldata data
    ) external {
        // require(block.chainid == 31337, "Test only");
        _onEvent(emitter, eventTopics, data);
    }
}
