pragma solidity ^0.6.0;

//import "node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "contracts/interfaces/IAuctionERC721.sol";

contract AuctionContract {

  address private administrator;
  //mapping of auctionId to AuctionDetails
  mapping (uint256 => AuctionDetails) public auctions;
  //pull over push design
  mapping(address => uint) bids;
  //enum to check auction status
  enum AuctionStatus { NotStarted, Bidding, EndAuction }

  constructor()
    public {
      administrator = msg.sender;
    }

  struct AuctionDetails {
    address payable auctioneer;
    address payable currentWinner;
    //ERC721 nftContract; //will initially be the address provided by msg.sender when filling a box maybe so that nftContract: ERC721(address);
    uint auctionId;
    AuctionStatus auctionStatus;
    uint startPrice;
    uint tokenId;
    bool auctionActive;
    //address[] bidders;
    //uint minimumIncrement;
    //variable for auction duration as well
  }

  modifier nftOwner () {
    //each ERC721 token has a tokenId
    //address owner = ownerOf(_tokenId);
    require(msg.sender == administrator, "must be the owner of the token");
    _;
  }

  function initializeAuction () external {
    //set to active
  }

  function startAuction () external {

  }

  function bidAuction () external {

  }
  /*
  function endBiddingPhase (uint256 _tokenId) nftOwner(uint _tokenId) public {

  }
  */

  function withdrawNft (uint256 _auctionId) public  {
    AuctionDetails storage details = auctions[_auctionId];
    require(details.auctionActive == true, "Auction must be active");
    require(msg.sender == details.currentWinner);
    details.auctionActive == false;
    require(bids[msg.sender] != 0, "no bids placed");
    bids[msg.sender] = 0;
    //details.nftContract.safeTransferFrom(details.currentWinner, msg.sender, details.tokenId);
  }

  function withdrawBid () public {
    //to implement pull over push pattern
    require(bids[msg.sender] != 0, "no bid to withdraw");
    //bids[msg.sender] = 0;
    //what happens to the current winner variable if highest bidder withdraw his/her bid??
    msg.sender.transfer(bids[msg.sender]);
  }


  }
