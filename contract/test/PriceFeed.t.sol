// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/PriceFeed.sol";

contract PriceFeedTest is Test {
    PriceFeed public priceFeed;

    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");

    function setUp() public {
        vm.prank(owner);
        priceFeed = new PriceFeed();
    }

    function test_InitialPricesSet() public view {
        assertEq(priceFeed.getPrice(PriceFeed.ETH), 2000_00000000);
        assertEq(priceFeed.getPrice(PriceFeed.BTC), 60000_00000000);
        assertEq(priceFeed.getPrice(PriceFeed.USDC), 1_00000000);
        assertEq(priceFeed.getPrice(PriceFeed.DAI), 1_00000000);
    }

    function test_OwnerCanUpdatePrice() public {
        vm.prank(owner);
        priceFeed.updatePrice(PriceFeed.ETH, 1500_00000000);
        assertEq(priceFeed.getPrice(PriceFeed.ETH), 1500_00000000);
    }

    function test_NonOwnerCannotUpdatePrice() public {
        vm.prank(user1);
        vm.expectRevert("Not owner");
        priceFeed.updatePrice(PriceFeed.ETH, 1500_00000000);
    }

    function test_OwnerCanUpdateMultiplePrices() public {
        address[] memory tokens = new address[](2);
        uint256[] memory prices = new uint256[](2);
        tokens[0] = PriceFeed.ETH;
        tokens[1] = PriceFeed.BTC;
        prices[0] = 1800_00000000;
        prices[1] = 55000_00000000;

        vm.prank(owner);
        priceFeed.updatePrices(tokens, prices);

        assertEq(priceFeed.getPrice(PriceFeed.ETH), 1800_00000000);
        assertEq(priceFeed.getPrice(PriceFeed.BTC), 55000_00000000);
    }

    function test_RevertsOnLengthMismatch() public {
        address[] memory tokens = new address[](2);
        uint256[] memory prices = new uint256[](1); // wrong length

        vm.prank(owner);
        vm.expectRevert("Length mismatch");
        priceFeed.updatePrices(tokens, prices);
    }

    function test_RevertsOnUnknownToken() public {
        vm.expectRevert("Price not set");
        priceFeed.getPrice(address(0x99));
    }

    function test_EmitsPriceUpdatedEvent() public {
        vm.prank(owner);
        vm.expectEmit(true, false, false, true);
        emit PriceFeed.PriceUpdated(
            PriceFeed.ETH,
            2000_00000000,
            1500_00000000
        );
        priceFeed.updatePrice(PriceFeed.ETH, 1500_00000000);
    }

    function test_OwnerCanTransferOwnership() public {
        vm.prank(owner);
        priceFeed.transferOwnership(user1);
        assertEq(priceFeed.owner(), user1);
    }

    function test_RevertsTransferToZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert("Zero address");
        priceFeed.transferOwnership(address(0));
    }

    function test_SymbolsSetCorrectly() public view {
        assertEq(priceFeed.tokenSymbols(PriceFeed.ETH), "ETH");
        assertEq(priceFeed.tokenSymbols(PriceFeed.BTC), "BTC");
        assertEq(priceFeed.tokenSymbols(PriceFeed.USDC), "USDC");
        assertEq(priceFeed.tokenSymbols(PriceFeed.DAI), "DAI");
    }
}
