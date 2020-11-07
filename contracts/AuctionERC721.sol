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

  //mapping of token ids to their owners. Not to forget that state variables _tokenOwners will also be updated upon minting, transfer...
  mapping (uint256 => address) private tokenCreators;


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

  /*
  function sendToken(address _sender, address _receiver, uint256 _tokenId)
  external
  {
    safeTransferFrom(_sender, _receiver, _tokenId);
  }
  */

  function removeToken(uint256 _tokenId)
  external
  onlyTokenOwner(_tokenId)
  override // marks as overrode as _burn is virtual
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

}
