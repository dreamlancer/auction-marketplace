//test1
//Can safeTransferFrom your own coin to valid contract
//This is where we use our ValidReceiver contract. Deploy that contract and send a token to it. If the transaction doesn’t fail and the contract is the new owner, then this test passes.

//test2
//Can’t safeTransferFrom your own coin to invalid contract
//Similar to the last test, but we deploy our InvalidReceiver and when we send a token to it we expect the transaction to fail.

let AuctionERC721 = artifacts.require('AuctionERC721')
let AuctionNft = artifacts.require('AuctionNft')
let catchRevert = require("./exceptionHelpers.js").catchRevert


contract('AuctionNft', function(accounts) {

  const deployer =accounts[0];

  beforeEach("create an instance of AuctionNft", async function() {
      instanceERC721 = await AuctionERC721.new("Auction NFT", "ANFT", {from: accounts[0]});
      instanceNft = await AuctionNft.new(instanceERC721.address, {from: accounts[0]});
  })

  describe("Deploy", () => {

    it("verify deployment and owner", async() => {


    })
  })

  describe("Functionnalities", () => {

    it("can create au auction and verify its features", async() => {
      await instanceERC721.addNewToken(deployer, "", {from: accounts[0]});
      //need to give approval to the auction contract
      await instanceERC721.approve(instanceNft.address, 0, {from: accounts[0]});
      await instanceNft.createAuction(instanceERC721.address, 1, 0, {from: accounts[0]});

      let nftOwner = await instanceERC721.ownerOf(0);
      assert.equal(nftOwner, instanceNft.address);


  })
})

})
