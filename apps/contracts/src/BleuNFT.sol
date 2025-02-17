// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BleuNFT is ERC721, Ownable {
    event Mint(address indexed to, uint256 indexed tokenId);
    event Staked(address indexed owner, uint256 indexed tokenId);
    event Unstaked(address indexed owner, uint256 indexed tokenId);

    mapping(uint256 => bool) public stakedTokens;
    mapping(uint256 => address) public tokenStaker;

    constructor(address initialOwner) ERC721("BleuNFT", "MNFT") Ownable(initialOwner) {}

    function mint(address to, uint256 tokenId) public onlyOwner {
        _mint(to, tokenId);
        emit Mint(to, tokenId);
    }

    function stake(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!stakedTokens[tokenId], "Already staked");

        stakedTokens[tokenId] = true;
        tokenStaker[tokenId] = msg.sender;
        
        emit Staked(msg.sender, tokenId);
    }

    function unstake(uint256 tokenId) public {
        require(stakedTokens[tokenId], "Not staked");
        require(tokenStaker[tokenId] == msg.sender, "Not the staker");

        stakedTokens[tokenId] = false;
        delete tokenStaker[tokenId];

        emit Unstaked(msg.sender, tokenId);
    }
}
