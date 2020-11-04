pragma solidity ^0.6.0;

import "node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


import "contracts/interfaces/IAuctionERC721.sol";

contract AuctionNft {

  //we get the address so that we can call the functions directly
  IAuctionERC721 public auctionERC721;

  //mapping of auctionId to AuctionDetails
  mapping (uint256 => AuctionDetails) public auctions;

  //pull over push design choice
  mapping(address => uint256) bids;

  //enum to check auction status
  enum AuctionStatus { NotStarted, Bidding, EndAuction , AuctionClaimed}

  struct AuctionDetails {
    address payable auctioneer;
    address payable currentWinner;
    //ERC721 nftContract; //will initially be the address provided by msg.sender when filling a box maybe so that nftContract: ERC721(address);
    uint auctionId;
    AuctionStatus auctionStatus;
    uint startPrice;
    uint tokenId;
    bool auctionComplete;
    //address[] bidders;
    //uint minimumIncrement;
    //variable for auction duration as well
  }

  address private owner;
  event NewAuctionERC721(address indexed _auctionERC721, uint _timestamp);

  modifier onlyOwner() {
    require(owner == msg.sender, "you are not authorized for this");
    _;
  }

  constructor(address _auctionERC721)
  public
  {
    setContractERC721(_auctionERC721);
    owner = msg.sender;
  }

  //in the createauction function, we will send ownership of the tokenId to the contract itself
  function createAuction() public {

  }

  function startAuction (uint _auctionId)
  external
  {
    require(auctions[_auctionId].auctionStatus == AuctionStatus.NotStarted, "Auction is already live or finished");
    auctions[_auctionId].auctionStatus = AuctionStatus.Bidding;
  }

  function bidAuction () external {

  }

  function withdrawNft (uint256 _auctionId) public  {
    AuctionDetails storage details = auctions[_auctionId];
    require(details.auctionComplete == true, "Auction must be active");
    require(msg.sender == details.currentWinner, "you are not the winner, nice try :)");
    details.auctionStatus == AuctionStatus.AuctionClaimed;
    require(bids[msg.sender] != 0, "no bids placed");
    bids[msg.sender] = 0;
    //safeTransferFrom(details.auctioneer, msg.sender, details.tokenId);
  }

  function withdrawBid () public {
    //to implement pull over push pattern
    require(bids[msg.sender] != 0, "no bid to withdraw");
    //bids[msg.sender] = 0;
    //what happens to the current winner variable if highest bidder withdraw his/her bid??
    msg.sender.transfer(bids[msg.sender]);
  }

  function setContractERC721(address _auctionERC721)
  public
  onlyOwner
  {
    auctionERC721 = IAuctionERC721(_auctionERC721);
    emit NewAuctionERC721(_auctionERC721, now);
  }

}
