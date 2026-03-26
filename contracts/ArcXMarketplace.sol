// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ArcXMarketplace is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    uint256 public mintedCount;
    uint256 public maxSupply; // 0 = unlimited

    struct NFT {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        uint256 launchTime;
    }

    mapping(uint256 => NFT) public idToNFT;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed owner,
        uint256 price,
        string tokenURI,
        uint256 launchTime
    );

    event NFTSold(
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price
    );

    constructor(uint256 _maxSupply) ERC721("ArcX NFT", "ARCX") Ownable(msg.sender) {
        maxSupply = _maxSupply;
    }

    /* Mint an NFT and list it in the marketplace */
    function mintNFT(string memory tokenURI, uint256 price, uint256 _launchTime) public payable nonReentrant returns (uint256) {
        if (maxSupply > 0) {
            require(mintedCount < maxSupply, "Max supply reached");
        }

        require(price > 0, "Price must be at least 1 wei");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        mintedCount++;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        idToNFT[newTokenId] = NFT(
            newTokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false,
            _launchTime
        );

        _transfer(msg.sender, address(this), newTokenId);

        emit NFTMinted(newTokenId, msg.sender, address(this), price, tokenURI, _launchTime);

        return newTokenId;
    }

    /* Buy an NFT from the marketplace */
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        uint256 price = idToNFT[tokenId].price;
        address seller = idToNFT[tokenId].seller;
        require(block.timestamp >= idToNFT[tokenId].launchTime, "NFT not yet launched");
        require(msg.value == price, "Please submit the asking price");
        require(idToNFT[tokenId].sold == false, "NFT already sold");

        idToNFT[tokenId].owner = payable(msg.sender);
        idToNFT[tokenId].sold = true;
        idToNFT[tokenId].seller = payable(address(0));

        _transfer(address(this), msg.sender, tokenId);
        
        payable(seller).transfer(msg.value);

        emit NFTSold(tokenId, seller, msg.sender, msg.value);
    }

    /* Helper function to get max supply info */
    function isUnlimited() public view returns (bool) {
        return maxSupply == 0;
    }

    /* Allows owner to update max supply if needed (within limits) */
    function updateMaxSupply(uint256 _newMaxSupply) public onlyOwner {
        if (_newMaxSupply > 0) {
            require(_newMaxSupply >= mintedCount, "New max supply below current minted count");
        }
        maxSupply = _newMaxSupply;
    }
}
