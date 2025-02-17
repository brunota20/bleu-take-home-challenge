// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {BleuNFT} from "../src/BleuNFT.sol";

contract BleuNFTScript is Script {
    BleuNFT public nft;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        address deployer = msg.sender;
        nft = new BleuNFT(deployer);
        nft.mint(msg.sender, 1);

        vm.stopBroadcast();
    }
}
