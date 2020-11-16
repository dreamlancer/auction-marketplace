let AuctionERC721 = artifacts.require('AuctionERC721')
let AuctionNft = artifacts.require('AuctionNft')
let catchRevert = require("./exceptionHelpers.js").catchRevert

contract('AuctionNft', function(accounts) {

  const deployer = accounts[0];
  const account2 = accounts[1];
  const account3 = accounts[2];

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

    it("can throw error when trying to pull nft while auction has not ended yet", async() => {
      await instanceERC721.addNewToken(deployer, "", {from: accounts[0]});
      await instanceERC721.approve(instanceNft.address, 0, {from: accounts[0]});
      await instanceNft.createAuction(instanceERC721.address, 1, 0, {from: accounts[0]});
      await instanceNft.bidAuction(0, {from: accounts[1], value: web3.utils.toWei("2", "ether")});
      await catchRevert(instanceNft.withdrawNft(0, {from: accounts[1]}));
    })

    it("can throw error when current winner tries to withdraw a bid", async() => {
      await instanceERC721.addNewToken(deployer, "", {from: accounts[0]});
      await instanceERC721.approve(instanceNft.address, 0, {from: accounts[0]});
      await instanceNft.createAuction(instanceERC721.address, 1, 0, {from: accounts[0]});
      await instanceNft.bidAuction(0, {from: accounts[1], value: web3.utils.toWei("2", "ether")});
      await instanceNft.bidAuction(0, {from: accounts[2], value: web3.utils.toWei("3", "ether")});
      let balanceBefore = await web3.eth.getBalance(accounts[1]);
      await instanceNft.withdrawBid(0, {from: accounts[1]});
      let balanceAfter = await web3.eth.getBalance(accounts[1]);
      let substract = balanceAfter - balanceBefore;
      await catchRevert(instanceNft.withdrawBid(0, {from: accounts[2]}));
      assert.equal(substract.toString().slice(0, 3), 199); // should get about 1.99 ether when including tx fees
    })

    it("can throw an error when a bidder is trying to withdraw a bid twice or someone else bid", async() => {
      await instanceERC721.addNewToken(deployer, "", {from: accounts[0]});
      await instanceERC721.approve(instanceNft.address, 0, {from: accounts[0]});
      await instanceNft.createAuction(instanceERC721.address, 1, 0, {from: accounts[0]});
      await instanceNft.bidAuction(0, {from: accounts[1], value: web3.utils.toWei("2", "ether")});
      await instanceNft.bidAuction(0, {from: accounts[2], value: web3.utils.toWei("3", "ether")});
      await instanceNft.bidAuction(0, {from: accounts[3], value: web3.utils.toWei("4", "ether")});
      await instanceNft.withdrawBid(0, {from: accounts[1]});
      await catchRevert(instanceNft.withdrawBid(0, {from: accounts[1]}));
      await catchRevert(instanceNft.withdrawBid(1, {from: accounts[1]}));
    })

    it("can verify the number of auction and tokenId are correct when multiple auctions", async() => {
      await instanceERC721.addNewToken(deployer, "", {from: accounts[0]});
      await instanceERC721.approve(instanceNft.address, 0, {from: accounts[0]});
      await instanceNft.createAuction(instanceERC721.address, 1, 0, {from: accounts[0]});

      await instanceERC721.addNewToken(account2, "", {from: accounts[1]});
      await instanceERC721.approve(instanceNft.address, 1, {from: accounts[1]});
      await instanceNft.createAuction(instanceERC721.address, 5, 1, {from: accounts[1]});

      await instanceERC721.addNewToken(account3, "", {from: accounts[2]});
      await instanceERC721.approve(instanceNft.address, 2, {from: accounts[2]});
      await instanceNft.createAuction(instanceERC721.address, 1, 2, {from: accounts[2]});

      let auctionCount = await instanceNft.auctionCount.call();
      assert.equal(auctionCount, 3);

      const result1 = await instanceNft.getFarmInfo.call(0);
      const result2 = await instanceNft.getFarmInfo.call(1);
      const result3 = await instanceNft.getFarmInfo.call(2);
      assert.equal(result1[7].toNumber(), 0);
      assert.equal(result2[7].toNumber(), 1);
      assert.equal(result3[7].toNumber(), 2);
    })

    it("verify that only the auctioneer can end his specific auction", async() => {
      await instanceERC721.addNewToken(deployer, "", {from: accounts[0]});
      await instanceERC721.approve(instanceNft.address, 0, {from: accounts[0]});
      await instanceNft.createAuction(instanceERC721.address, 1, 0, {from: accounts[0]});

      await catchRevert(instanceNft.endAuction(0, {from: accounts[1]}));
      await instanceNft.endAuction(0, {from: accounts[0]});

      const result = await instanceNft.getFarmInfo.call(0);
      assert.equal(result[8], true);
    })

    it("verify that the winner is the owner of the nft after ", async() => {
      await instanceERC721.addNewToken(deployer, "", {from: accounts[0]});
      await instanceERC721.approve(instanceNft.address, 0, {from: accounts[0]});
      await instanceNft.createAuction(instanceERC721.address, 1, 0, {from: accounts[0]});
      await instanceNft.bidAuction(0, {from: accounts[1], value: web3.utils.toWei("2", "ether")});
      await instanceNft.endAuction(0, {from: accounts[0]});
      await catchRevert(instanceNft.withdrawNft(0, {from: accounts[2]}));
      await instanceNft.withdrawNft(0, {from: accounts[1]});
      await catchRevert(instanceNft.withdrawNft(0, {from: accounts[1]})); // logically it would fail as nft was already sent from contract

      let nftOwner = await instanceERC721.ownerOf(0);
      assert.equal(nftOwner, account2);
    })

    it("verify an auction process end to end workflow (multiple bids, winner)", async() => {

    })

})

})
