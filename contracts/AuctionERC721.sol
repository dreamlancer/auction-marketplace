pragma solidity ^0.6.0;

import "node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "contracts/interfaces/IAuctionERC721.sol";

// will add the nft details in the deployment script
// contract to handle minting, removal... of the nft used in auctions
contract AuctionERC721 is ERC721, Ownable, IAuctionERC721 {

  // Counter variable for creation of token IDs and used to pass to the mint function, verifying nft doesn't exist yet
  uint256 private idCounter;

  address public whitelisted;

  //mapping of auctionId to AuctionDetails
  mapping (uint256 => AuctionDetails) public auctions;

  //pull over push design choice
  mapping(address => uint256) bids;

  //enum to check auction status
  enum AuctionStatus { NotStarted, Bidding, EndAuction , AuctionClaimed}

  //mapping of token ids to their owners. Not to forget that state variables _tokenOwners will also be updated upon minting, transfer...
  mapping (uint256 => address) private tokenCreators;

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

  constructor (
    string memory _name,
    string memory _symbol
  )
  public
  ERC721(_name, _symbol)
     {

     }

  //
  modifier onlyTokenOwner(uint256 _tokenId) {
        address owner = ownerOf(_tokenId);
        require(msg.sender == owner, "must be the owner of the token!");
        _;
    }

  /**
    * @dev Gets the creator of the token.
    * @param _tokenId uint256 ID of the token.
    * @return address of the creator.
    */
  function tokenCreator(uint256 _tokenId)
  public
  view
  returns (address)
  {
      return tokenCreators[_tokenId];
  }

  /**
    * @dev Internal function for setting the token's creator.
    * @param _tokenId uint256 id of the token.
    * @param _creator address of the creator of the token.
    */
  function _setTokenCreator(uint256 _tokenId, address _creator)
  internal
  {
      tokenCreators[_tokenId] = _creator;
  }

  /**
     * @dev Adds a new unique token to the supply.
     * @param _uri string metadata uri associated with the token.
     */
  function addNewToken(address _receiver, string calldata _uri)
  external
  //onlyTokenOwner(_tokenId)
  override // marks as overrode as _setTokenURI is virtual
  returns (uint256 _tokenId)
  {
    return _createToken(_uri, _receiver);
  }

  function removeToken(uint256 _tokenId)
  external
  onlyTokenOwner(_tokenId)
  {
    _burn(_tokenId);
  }

  /**
     * @dev Internal function creating a new token.
     * @param _uri string metadata uri associated with the token
     * @param _creator address of the creator of the token.
     */
  function _createToken(string memory _uri, address _creator)
  internal
  returns (uint256)
  {
    uint256 newId = idCounter;
    idCounter++;
    _mint(_creator, newId); // found in ERC721.sol
    _setTokenURI(newId, _uri); // found in ERC721.sol
    _setTokenCreator(newId, _creator);
    return newId;
  }

  // we can use the uri metadat as input
  function initializeAuction () external {
    //set to active
  }

  function startAuction (uint _auctionId)
  external
  onlyTokenOwner (auctions[_auctionId].tokenId)
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
    safeTransferFrom(details.auctioneer, msg.sender, details.tokenId);
  }

  function withdrawBid () public {
    //to implement pull over push pattern
    require(bids[msg.sender] != 0, "no bid to withdraw");
    //bids[msg.sender] = 0;
    //what happens to the current winner variable if highest bidder withdraw his/her bid??
    msg.sender.transfer(bids[msg.sender]);
  }
}
