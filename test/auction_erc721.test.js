let AuctionERC721 = artifacts.require('AuctionERC721')


contract('AuctionERC721', function(accounts) {

  const owner = accounts[0]
  const uri = "test"



  beforeEach(async () => {
      instance = await AuctionERC721.new()
  })

  it("should be able to mint a new token", async() => {

  })
})
