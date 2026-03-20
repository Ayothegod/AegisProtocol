// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Aegis} from "../src/Aegis.sol";

contract AegisTest is Test {
    Aegis public aegisProtocal;

    function setUp() public {
        aegisProtocal = new Aegis();
        aegisProtocal.setNumber(0);
    }

    function test_Increment() public {
        aegisProtocal.increment();
        assertEq(aegisProtocal.number(), 1);
    }

    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
