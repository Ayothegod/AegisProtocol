// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {AegisProtocol} from "../src/Aegis.sol";

contract AegisTest is Test {
    AegisProtocol public aegis;

    function setUp() public {
        aegis = new AegisProtocol();
        aegis.setNumber(0);
    }

    function test_Increment() public {
        aegis.increment();
        assertEq(aegis.number(), 1);
    }

    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}

// forge test -vvv
// forge test --match-test Increment
