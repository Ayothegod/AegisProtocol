// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {AegisProtocol} from "../src/Aegis.sol";

contract AegisScript is Script {
    AegisProtocol public aegis;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        aegis = new AegisProtocol();

        vm.stopBroadcast();
    }
}
