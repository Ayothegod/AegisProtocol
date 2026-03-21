// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract PriceFeed {
    address public owner;

    mapping(address => uint256) public prices;
    mapping(address => string) public tokenSymbols;

    address public constant ETH = address(0x1);
    address public constant BTC = address(0x2);
    address public constant USDC = address(0x3);
    address public constant DAI = address(0x4);

    event PriceUpdated(
        address indexed token,
        uint256 oldPrice,
        uint256 newPrice
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;

        // Initial price seed
        _setPrice(ETH, 2000_00000000, "ETH"); // $2000
        _setPrice(BTC, 60000_00000000, "BTC"); // $60000
        _setPrice(USDC, 1_00000000, "USDC"); // $1
        _setPrice(DAI, 1_00000000, "DAI"); // $1
    }

    // ── Internal setter ────────────────────────────────────
    function _setPrice(
        address token,
        uint256 price,
        string memory symbol
    ) internal {
        prices[token] = price;
        tokenSymbols[token] = symbol;
    }

    function updatePrice(address token, uint256 newPrice) external onlyOwner {
        uint256 oldPrice = prices[token];
        prices[token] = newPrice;
        emit PriceUpdated(token, oldPrice, newPrice);
    }

    function updatePrices(
        address[] calldata tokens,
        uint256[] calldata newPrices
    ) external onlyOwner {
        require(tokens.length == newPrices.length, "Length mismatch");
        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 oldPrice = prices[tokens[i]];
            prices[tokens[i]] = newPrices[i];
            emit PriceUpdated(tokens[i], oldPrice, newPrices[i]);
        }
    }

    function getPrice(address token) external view returns (uint256) {
        uint256 price = prices[token];
        require(price > 0, "Price not set");
        return price;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }
}
