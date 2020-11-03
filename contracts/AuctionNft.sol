pragma solidity ^0.6.0;

import "node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


import "contracts/interfaces/IAuctionERC721.sol";

contract AuctionNft {

  IAuctionERC721 public auctionERC721;

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

  function setContractERC721(address _auctionERC721)
  public
  onlyOwner
  {
    auctionERC721 = IAuctionERC721(_auctionERC721);
    emit NewAuctionERC721(_auctionERC721, now);
  }
}
