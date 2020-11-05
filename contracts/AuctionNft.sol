pragma solidity ^0.6.0;

import "node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

//below interface used for the AuctionNft contract to be able to receive AuctionNft
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "contracts/interfaces/IAuctionERC721.sol";

contract AuctionNft is ERC721Holder{

  //we get the address so that we can call the functions directly
  IAuctionERC721 public auctionERC721;

  //mapping of auctionId to AuctionDetails
  mapping (uint256 => AuctionDetails) public auctions;


  // Allowed withdrawals of previous bids
  // pull over push design
  mapping(address => uint256) pendingReturns;

  //enum to check auction status
  enum AuctionStatus { NotStarted, Bidding, EndAuction , AuctionClaimed}

  struct AuctionDetails {
    address tokenERC721;
    address payable auctioneer;
    address payable currentWinner;
    //ERC721 nftContract; //will initially be the address provided by msg.sender when filling a box maybe so that nftContract: ERC721(address);
    uint auctionId;
    AuctionStatus auctionStatus;
    uint256 highestBid;
    uint256 startPrice;
    uint256 tokenId;
    bool auctionComplete;
    //address[] bidders;
    //uint minimumIncrement;
    //variable for auction duration as well
  }

  address private owner;
  event NewAuctionERC721(address indexed _auctionERC721, uint _timestamp);


  event HighestBidIncreased(address currentWinner, uint highestBid);


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

  //either we are going to use the below or the transfer function

  //present in ERC721Holder but will it work??
  /*
  function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes _data)
  external
  returns(bytes4) {
    return 0x150b7a02;
  }
  */

  //in the createauction function, we will send ownership of the tokenId to the contract itself
  function createAuction() public {

  }

  function startAuction (uint _auctionId)
  external
  {
    AuctionDetails memory details = auctions[_auctionId];
    require(details.auctionStatus == AuctionStatus.NotStarted, "Auction is already live or finished");
    IERC721(details.tokenERC721).safeTransferFrom(msg.sender, address(this), details.tokenId); //not possible to use require here as safeTransferFrom doesn't return anything
    details.auctionStatus = AuctionStatus.Bidding;
  }

  function bidAuction (uint _auctionId) external payable {
    AuctionDetails memory details = auctions[_auctionId];
    require(details.auctionStatus == AuctionStatus.Bidding, "Auction is not bidabble yet");
    require(msg.value > details.highestBid, "bid not high enough");
    if(details.highestBid != 0) {
      pendingReturns[details.currentWinner] += details.highestBid;
    }
    details.highestBid = msg.value;
    details.currentWinner = msg.sender;
    emit HighestBidIncreased(msg.sender, msg.value);
  }

  function withdrawNft (uint256 _auctionId) public  {
    AuctionDetails memory details = auctions[_auctionId];
    require(details.auctionComplete == true, "Auction must be active");
    require(msg.sender == details.currentWinner, "you are not the winner, nice try :)");
    details.auctionStatus == AuctionStatus.AuctionClaimed;
    /* below might not be needed if we never push current winner bid into the pendingReturns mapping */
    //require(pendingReturns[msg.sender] != 0, "no bids placed");
    //pendingReturns[msg.sender] = 0;
    //safeTransferFrom(details.auctioneer, msg.sender, details.tokenId);
  }

  function withdrawBid () public {
    //to implement pull over push pattern
    require(pendingReturns[msg.sender] != 0, "no bid to withdraw");
    //bids[msg.sender] = 0;
    //what happens to the current winner variable if highest bidder withdraw his/her bid??
    msg.sender.transfer(pendingReturns[msg.sender]);
  }

  function setContractERC721(address _auctionERC721)
  public
  onlyOwner
  {
    auctionERC721 = IAuctionERC721(_auctionERC721);
    emit NewAuctionERC721(_auctionERC721, now);
  }

}
