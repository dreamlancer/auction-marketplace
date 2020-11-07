const AuctionERC721 = artifacts.require("./AuctionERC721.sol");
const AuctionNft = artifacts.require("./AuctionNft.sol");

module.exports = async function (deployer, accounts) {
  await deployer.deploy(AuctionERC721, "Auction NFT", "ANFT");
  await deployer.deploy(AuctionNft, AuctionERC721.address);

};
