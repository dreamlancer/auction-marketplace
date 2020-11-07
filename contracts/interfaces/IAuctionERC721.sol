pragma solidity ^0.6.0;

interface IAuctionERC721 {
  function addNewToken(address _receiver, string calldata _uri) external returns (uint256 _tokenId);
  function removeToken(uint256 _tokenId) external;
  function getTokenCreators() external view returns (uint256[] memory);
  //function sendToken(address _sender, address _receiver, uint256 _tokenId) external;
}
