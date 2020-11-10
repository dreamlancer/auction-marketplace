let AuctionERC721 = artifacts.require('AuctionERC721')
let catchRevert = require("./exceptionHelpers.js").catchRevert


contract('AuctionERC721', function(accounts) {

  const deployer = accounts[0];
  const minter = accounts[1];
  const secondMinter = accounts[2];
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


    it("should be able to retrieve the correct token creators", async() => {

      await instance.addNewToken(deployer, "", {from: accounts[0]});
      await instance.addNewToken(minter, "", {from: accounts[1]});

      await instance.removeToken(1, {from: accounts[1]});

      let firstNftOwner = await instance.ownerOf(0);
      let secondNftOwner = await catchRevert(instance.ownerOf(1)); //should throw "ERC721: owner query for nonexistent token"

      assert.equal(deployer, firstNftOwner);
      assert.notEqual(minter, secondNftOwner);

    })


    it("should not be able to transfer a token not owner nor authorized", async() => {

      await instance.addNewToken(deployer, "", {from: accounts[0]});
      await instance.addNewToken(minter, "", {from: accounts[1]});
      await instance.addNewToken(secondMinter, "", {from: accounts[2]});

      await instance.safeTransferFrom(deployer, minter, 0);
      await catchRevert(instance.safeTransferFrom(deployer, minter, 0));
      await instance.safeTransferFrom(secondMinter, minter, 2, {from: accounts[2]});
      await catchRevert(instance.safeTransferFrom(secondMinter, deployer, 1, {from: accounts[2]}));

      let nftBalance = await instance.balanceOf(accounts[0]);
      let secondNftBalance = await instance.balanceOf(accounts[1]);
      let thirdNftBalance = await instance.balanceOf(accounts[2]);

      assert.equal(nftBalance.toNumber(), 0);
      assert.equal(secondNftBalance.toNumber(), 3);
      assert.equal(thirdNftBalance.toNumber(), 0);
    })


    it("should be able to be approved and transfer coins", async() => {

      await instance.addNewToken(deployer, "", {from: accounts[0]});
      await instance.approve(minter, 0, {from: accounts[0]});
      let isApproved = await instance.getApproved(0);
      assert.equal(minter, isApproved);

      await instance.safeTransferFrom(deployer, secondMinter, 0, {from: accounts[1]});
      let isApprovedSecond = await instance.getApproved(0);
      assert.notEqual(isApprovedSecond, isApproved); // verify the approval has been cleared (address(0) should have the approval)
    })


    it("should not be able to transfer coin anymore after sending", async() => {

      await instance.addNewToken(deployer, "", {from: accounts[0]});
      await instance.approve(minter, 0, {from: accounts[0]});

      await instance.safeTransferFrom(deployer, secondMinter, 0, {from: accounts[1]});
      await catchRevert(instance.approve(minter, 0, {from: accounts[0]})); //verify approval has been cleared and cannot approve anymore
      let isApproved = await instance.getApproved(0);
      assert.notEqual(minter, isApproved);

    })

  })

})
