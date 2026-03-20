// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Aegis} from "../src/Aegis.sol";

contract AegisScript is Script {
    Aegis public aegisProtocal;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        aegisProtocal = new Aegis();

        vm.stopBroadcast();
    }
}
