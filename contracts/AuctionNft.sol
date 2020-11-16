pragma solidity ^0.6.0;

import "node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

//below interface used for the AuctionNft contract to be able to receive AuctionNft
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "contracts/interfaces/IAuctionERC721.sol";

/**
 * @title Inheritance
 * @dev Our contract needs to support safeTransfers
 */
contract AuctionNft is ERC721Holder{

  //we get the address so that we can call the functions directly (potentially future features)
  IAuctionERC721 public auctionERC721;

  //mapping of auctionId to AuctionDetails
  mapping (uint256 => AuctionDetails) public auctions;

  //counter for number of auctions
  uint256 public auctionCount;

  // Allowed withdrawals of previous bids
  // pull over push design
  //"a bidder can bid on different auctions a specific amount"
  mapping(address => mapping (uint256 => uint256)) pendingReturns;

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

  AuctionDetails[] public nftAuctions;

  address public owner;

  event NewAuctionERC721(address indexed _auctionERC721, uint _timestamp);
  event NewAuctionCreated(address _auctioneer, uint _auctionId);
  event HighestBidIncreased(address _currentWinner, uint _highestBid);
  event NewAutionStarted(address _creator, uint _auctionId);
  event AuctionEnded(uint _auctionId);
  event NftWithdrawn(uint _tokenId, address _nftWinner);
  event BidWithdrawn(address _bidder);
  event BidClaimed(address _auctioneer);

  modifier onlyOwner() {
    require(owner == msg.sender, "you are not authorized for this");
    _;
  }

  constructor(address _auctionERC721)
  public
  {
    owner = msg.sender;
    setContractERC721(_auctionERC721);
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
  function createAuction(address _tokenERC721, uint256 _startPrice, uint _tokenId)
  public
  returns (uint _accountId)
  {
    //require(auctionERC721.ownerOf(_tokenId) == msg.sender);

    AuctionDetails memory newAuction = AuctionDetails({
      tokenERC721 : _tokenERC721,
      auctioneer : msg.sender,
      currentWinner : address(0),
      auctionId : auctionCount,
      auctionStatus : AuctionStatus.NotStarted,
      highestBid : 0,
      startPrice : _startPrice,
      tokenId : _tokenId,
      auctionComplete : false
      });

    nftAuctions.push(newAuction);
    auctions[auctionCount] = newAuction;

    //let's start the function internally first
    //the transferFrom in the below function should succeed else the entire createAuction call will revert
    startAuction(auctionCount);

    auctionCount ++;
    emit NewAuctionCreated(msg.sender, auctionCount);

    return auctionCount;
  }


  function startAuction (uint _auctionId)
  internal
  {
    AuctionDetails storage details = auctions[_auctionId];
    require(details.auctionStatus == AuctionStatus.NotStarted, "Auction is already live or finished");
    IERC721(details.tokenERC721).safeTransferFrom(msg.sender, address(this), details.tokenId); //not possible to use require here as safeTransferFrom doesn't return anything
    //require(IERC721(details.tokenERC721).transferFrom(msg.sender, address(this), details.tokenId), "token transfer failed");
    details.auctionStatus = AuctionStatus.Bidding;
    emit NewAutionStarted(msg.sender, _auctionId);
  }

  function bidAuction (uint _auctionId)
  external
  payable
  {
    AuctionDetails storage details = auctions[_auctionId];
    require(details.auctionStatus == AuctionStatus.Bidding, "Auction is not bidabble yet");
    require(msg.value > details.highestBid, "bid not high enough");
    if(details.highestBid != 0) {
      pendingReturns[details.currentWinner][_auctionId] += details.highestBid;
    }
    details.highestBid = msg.value;
    details.currentWinner = msg.sender;
    emit HighestBidIncreased(msg.sender, msg.value);
  }

  function endAuction (uint _auctionId)
  public
  {
    AuctionDetails storage details = auctions[_auctionId];
    require(details.auctionStatus == AuctionStatus.Bidding, "Auction not biddable nor created yet");
    require(details.auctioneer == msg.sender);
    details.auctionComplete = true;
    emit AuctionEnded(_auctionId);
  }

  function withdrawNft (uint256 _auctionId)
  public
  {
    AuctionDetails storage details = auctions[_auctionId];
    require(details.auctionComplete == true, "Auction must be active");
    require(msg.sender == details.currentWinner, "you are not the winner, nice try :)");
    IERC721(details.tokenERC721).safeTransferFrom(address(this), msg.sender,  details.tokenId);
    pendingReturns[msg.sender][_auctionId] = 0;
    details.auctionStatus == AuctionStatus.AuctionClaimed;
    emit NftWithdrawn(details.tokenId, details.currentWinner);
    /* below might not be needed if we never push current winner bid into the pendingReturns mapping */
    //require(pendingReturns[msg.sender] != 0, "no bids placed");
    //pendingReturns[msg.sender] = 0;
    //safeTransferFrom(details.auctioneer, msg.sender, details.tokenId);
  }

  function withdrawBid (uint256 _auctionId)
  public
  {
    //to implement pull over push pattern
    //AuctionDetails memory details = auctions[_auctionId];
    require(pendingReturns[msg.sender][_auctionId] != 0, "no bid to withdraw");
    uint amount = pendingReturns[msg.sender][_auctionId];
    //bids[msg.sender] = 0;
    //what happens to the current winner variable if highest bidder withdraw his/her bid??
    if (amount > 0)
    {
      pendingReturns[msg.sender][_auctionId] = 0; //to avoid reentrancy attacks
      msg.sender.transfer(amount);
    }
    emit BidWithdrawn(msg.sender);
  }

  function withdrawHighestBid (uint256 _auctionId)
  public
  {
    AuctionDetails storage details = auctions[_auctionId];
    require(details.auctionComplete == true, "Auction must be active");
    require(msg.sender == details.auctioneer, "you are not the auctioneer, nice try :)");
    uint amount = details.highestBid;
    if ( amount > 0)
    {
      details.highestBid = 0;
      msg.sender.transfer(amount);
    }
    emit BidClaimed(msg.sender);
  }

  function setContractERC721(address _auctionERC721)
  public
  onlyOwner
  {
    auctionERC721 = IAuctionERC721(_auctionERC721);
    emit NewAuctionERC721(_auctionERC721, now);
  }

  function getNumberOfAuctions()
  external
  view
  returns(uint256 _nbOfAuctions)
  {
    return nftAuctions.length;
  }

  function getAuctionInfo(uint256 _auctionId)
  external
  view
  returns (address _tokenERC721, address _auctioneer, address _currentWinner, uint auctionId, AuctionStatus _auctionStatus, uint _highestBid, uint _startPrice, uint _tokenId, bool _auctionComplete)
  {
    AuctionDetails memory auction = auctions[_auctionId];
    return (auction.tokenERC721, auction.auctioneer, auction.currentWinner, auction.auctionId, auction.auctionStatus, auction.highestBid, auction.startPrice, auction.tokenId, auction.auctionComplete);
  }

}
