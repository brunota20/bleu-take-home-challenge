// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {BleuNFT} from "../src/BleuNFT.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BleuNFTTest is Test {
    BleuNFT public nft;
    address public owner = address(0x1);
    address public user = address(0x2);

    function setUp() public {
        vm.prank(owner); // Simulate contract deployment by owner
        nft = new BleuNFT(owner);
    }

    function testMint() public {
        vm.prank(owner); // Set caller as owner
        nft.mint(user, 1);

        assertEq(nft.ownerOf(1), user);
    }

    function test_RevertWhen_NonOwnerMints() public {
    vm.prank(user); // Simulate a non-owner call
    vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user));
    nft.mint(user, 2); // Should revert
}


    function testStake() public {
        vm.prank(owner);
        nft.mint(user, 1);

        vm.prank(user);
        nft.stake(1);

        assertTrue(nft.stakedTokens(1));
        assertEq(nft.tokenStaker(1), user);
    }

    function test_RevertWhen_NotOwnerStakes() public {
        vm.prank(owner);
        nft.mint(user, 1);

        vm.prank(address(0x3)); // Another user tries to stake
        vm.expectRevert("Not the owner");
        nft.stake(1); // Should revert
    }

    function testUnstake() public {
        vm.prank(owner);
        nft.mint(user, 1);

        vm.prank(user);
        nft.stake(1);
        vm.prank(user);
        nft.unstake(1);

        assertFalse(nft.stakedTokens(1));
        assertEq(nft.tokenStaker(1), address(0));
    }

    function test_RevertWhen_NotStakerUnstakes() public {
        vm.prank(owner);
        nft.mint(user, 1);

        vm.prank(user);
        nft.stake(1);

        vm.prank(owner);
        vm.expectRevert("Not the staker");
        nft.unstake(1); // Should revert
    }
}