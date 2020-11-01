pragma solidity ^0.5.16;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";


contract AuctionContract is ERC721Full {

  //mapping of auctionId to AuctionDetails
  mapping (uint256 => AuctionDetails) public auctions;
  mapping (address => )
  //enum to check auction status
  enum AuctionStatus { NotStarted, Bidding, EndAuction }

  struct AuctionDetails {
    address payable auctioneer;
    address payable currentWinner;
    ERC721 nftContract;
    uint auctionId;
    AuctionStatus auctionStatus;
    uint price;
    uint tokenId;
    bool auctionActive;
    //address[] bidders;
    //uint minimumIncrement;
    //variable for auction duration as well
  }

  modifier nftOwner (uint256 _tokenId) {
    //each ERC721 token has a tokenId
    address owner = ownerOf(_tokenId);
    require(msg.sender == owner, "must be the owner of the token");
    _;
  }

  function initializeAuction {
    //set to active
  }

  function startAuction {

  }

  function bidAuction {

  }

  function withdrawNft (uint256 _auctionId) external  {
    require(auctions[_auctionId].auctionActive == true, "Auction must be active");
    require(msg.sender == details.currentWinner);
    auctions[_auctionId].auctionActive == false;
    auctions[_auctionId].nftContract.safeTransferFrom(auctions[_auctionId].seller, msg.sender, auctions[_auctionId].tokenId);

  }


  }
