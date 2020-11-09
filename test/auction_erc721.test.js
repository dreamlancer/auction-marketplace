let AuctionERC721 = artifacts.require('AuctionERC721')
let catchRevert = require("./exceptionHelpers.js").catchRevert


contract('AuctionERC721', function(accounts) {

  const deployer = accounts[0]
  const uri = "test"



  beforeEach("create an instance of AuctionERC721", async function() {
      instance = await AuctionERC721.new("Auction NFT", "ANFT", {from: accounts[0]});
  })


  describe("Functionnalities", () => {


    it("should be able to mint a new token", async() => {
      //we use add new token from the AuctionERC721.sol and verify the output is of idcounter is 1
      //we are verifying the inheritance
      await instance.addNewToken(deployer, "", {from: accounts[0]});
      let nftBalance = await instance.balanceOf(accounts[0]);
      let nftOwner = await instance.ownerOf(0);

      assert.equal(deployer, nftOwner);
      assert.equal(nftBalance.toNumber(), 1);
    })

    //we will test the catch error of onlytokenowner
    it("should not be able to remove a token", async() => {
      await instance.addNewToken(deployer, "", {from: accounts[0]});
      await catchRevert(instance.removeToken(0, {from: accounts[1]}), "shouldn't not be able to burn the nft as you are not the owner");
    })


    it("should not be able to mint a token already minted")
    //we will test the catch error of onlytokenowner

    it("should not be able to transfer a token not owner nor authorized")
    //we will test the catch error of onlytokenowner

    it("should be able to be approved and transfer coins")
  })

})
