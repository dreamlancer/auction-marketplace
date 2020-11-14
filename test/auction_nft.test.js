let AuctionERC721 = artifacts.require('AuctionERC721')
let AuctionNft = artifacts.require('AuctionNft')
let catchRevert = require("./exceptionHelpers.js").catchRevert

contract('AuctionNft', function(accounts) {

  const deployer = accounts[0];

  beforeEach("create an instance of AuctionNft", async function() {
      instanceERC721 = await AuctionERC721.new("Auction NFT", "ANFT", {from: accounts[0]});
      instanceNft = await AuctionNft.new(instanceERC721.address, {from: accounts[0]});
  })



  describe("Deploy", () => {

    it("verify deployment and owner", async() => {
      let ownerCheck = await instanceNft.owner.call();
      let contractAddress = await instanceNft.auctionERC721.call();

      assert.equal(contractAddress, instanceERC721.address);
      assert.equal(ownerCheck,deployer);
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

    it("can verify the auction different related balances and variables", async() => {

      await instanceERC721.addNewToken(deployer, "", {from: accounts[0]});
      await instanceERC721.approve(instanceNft.address, 0, {from: accounts[0]});
      await instanceNft.createAuction(instanceERC721.address, 1, 0, {from: accounts[0]});
      let balanceCheck = await instanceERC721.balanceOf(instanceNft.address);
      let auctionCountCheck = await instanceNft.auctionCount.call();

      assert.equal(balanceCheck.toNumber(), 1);
      assert.equal(auctionCountCheck.toNumber(), 1);
    })

    it("can verify auction info after bidding", async() => {

      await instanceERC721.addNewToken(deployer, "", {from: accounts[0]});
      await instanceERC721.approve(instanceNft.address, 0, {from: accounts[0]});
      await instanceNft.createAuction(instanceERC721.address, 1, 0, {from: accounts[0]});
      await instanceNft.bidAuction(0, {from: accounts[1], value: web3.utils.toWei("2", "ether")});

      const result = await instanceNft.getFarmInfo.call(0);
      assert.equal(result[0], instanceERC721.address);
      assert.equal(result[1], accounts[0]);
      assert.equal(result[2], accounts[1]);
      assert.equal(result[3], 0);
      assert.equal(result[4].toString(10), 1); //the state of the auction should be "Bidding" which is declared second in our enum
      assert.equal(result[5].toString().slice(0, 1), 2);
      assert.equal(result[6].toString().slice(0, 1), 1);
      assert.equal(result[7].toNumber(), 0);
      assert.equal(result[8], false);
})

})

})
