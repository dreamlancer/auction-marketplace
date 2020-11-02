pragma solidity ^0.6.0;

interface IAuctionERC721 {
  function addNewToken(address _receiver, string calldata _uri) external returns (uint256 _tokenId);
}
