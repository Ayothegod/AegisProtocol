// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

//   Store a user's position (collateral, debt, threshold, strategy)
// Let users register a new position
// Let users update their position
// Let users delete their position
// Let anyone read a position's details
contract PositionRegistry {
    enum Strategy {
        ALERT_ONLY,
        AUTO_TOPUP,
        AUTO_REPAY
    }

    struct Position {
        address owner;
        uint256 collateral;
        uint256 debt;
        uint256 threshold;
        Strategy strategy;
        bool isActive;
        uint256 createdAt;
    }

    uint256 public positionCount;
    mapping(uint256 => Position) public positions;
    mapping(address => uint256[]) public ownerPositions;

    event PositionRegistered(uint256 indexed positionId, address indexed owner);
    event PositionUpdated(uint256 indexed positionId, address indexed owner);
    event PositionDeleted(uint256 indexed positionId, address indexed owner);

    modifier onlyOwner(uint256 positionId) {
        _onlyOwner(positionId);
        _;
    }

    modifier positionExists(uint256 positionId) {
        _positionExists(positionId);
        _;
    }

    function registerPosition(
        uint256 collateral,
        uint256 debt,
        uint256 threshold,
        Strategy strategy
    ) external returns (uint256) {
        require(collateral > 0, "Collateral must be greater than 0");
        require(debt > 0, "Debt must be greater than 0");
        require(threshold > 0, "Threshold must be greater than 0");

        uint256 positionId = positionCount++;

        positions[positionId] = Position({
            owner: msg.sender,
            collateral: collateral,
            debt: debt,
            threshold: threshold,
            strategy: strategy,
            isActive: true,
            createdAt: block.timestamp
        });

        ownerPositions[msg.sender].push(positionId);

        emit PositionRegistered(positionId, msg.sender);

        return positionId;
    }

    function updatePosition(
        uint256 positionId,
        uint256 newCollateral,
        uint256 newDebt,
        uint256 newThreshold,
        Strategy newStrategy
    ) external onlyOwner(positionId) positionExists(positionId) {
        Position storage position = positions[positionId];

        position.collateral = newCollateral;
        position.debt = newDebt;
        position.threshold = newThreshold;
        position.strategy = newStrategy;

        emit PositionUpdated(positionId, msg.sender);
    }

    function deletePosition(
        uint256 positionId
    ) external onlyOwner(positionId) positionExists(positionId) {
        positions[positionId].isActive = false;
        emit PositionDeleted(positionId, msg.sender);
    }

    function getPosition(
        uint256 positionId
    ) external view returns (Position memory) {
        return positions[positionId];
    }

    function getOwnerPositions(
        address owner
    ) external view returns (uint256[] memory) {
        return ownerPositions[owner];
    }

    function _onlyOwner(uint256 positionId) internal view {
        require(
            positions[positionId].owner == msg.sender,
            "Not position owner"
        );
    }

    function _positionExists(uint256 positionId) internal view {
        require(positions[positionId].isActive, "Position does not exist");
    }
}
