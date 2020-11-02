const AuctionERC721 = artifacts.require("./AuctionERC721.sol");

module.exports = async function (deployer) {
  await deployer.deploy(AuctionERC721, "Auction NFT", "ANFT");
};
