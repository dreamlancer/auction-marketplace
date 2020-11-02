pragma solidity ^0.6.0;

import "node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

import "contracts/interfaces/IAuctionERC721.sol";

// will add the nft details in the deployment script
contract AuctionERC721 is ERC721, Ownable, IAuctionERC721 {

  // Counter variable for creation of token IDs
  uint256 private idCounter;

  address public whitelisted;

  constructor (
    string memory _name,
    string memory _symbol
  )
  public
  ERC721(_name, _symbol)
     {

     }

  modifier onlyTokenOwner(uint256 _tokenId) {
        address owner = ownerOf(_tokenId);
        require(msg.sender == owner, "must be the owner of the token!");
        _;
    }


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
    _setTokenURI(newId, _uri); // found in ERC721Metadata.sol
    //_setTokenCreator(newId, _creator);
    return newId;
  }
}
