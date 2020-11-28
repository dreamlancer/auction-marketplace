# auction-marketplace

## What does your project do?

I have decided to create a marketplace that lets you mint NFTs and auction them. The Dapp lets a user mints an NFT for herself or someone else. The NFT in a DApp is predefined with a given name (Auction NFT) and a symbol (ANFT).

The goal for me was to create the backbone of a marketplace where minting, auction creation and bidding/claiming functions were made available to the user.
The basic above functionnalities also come along with getters so that a user is able to retrieve her current NFT count balance as well as seeing her NFT numbers.

NFTs tokens are defined by tokenIds which are accessible through the button "Retrieve all your NFTs". Every NFT is identified by a unique uint256 ID inside the ERC-721 smart contract. The metadata extension is optional and allows for a URI to be associated with a tokenID.

An auctioneer, owner of an auction, can create an auction and end it; bidders can bid and overbid; the auction winner can claim her NFT.

## User stories

A user accesses the DApp with a Metamask account setup and is able to mint an NFT and send it to herself or someone else by pasting the address of the recipient.
The metadata can also be filled but the DApp doesn't make use of the metadata at the moment.

The user can check her NFT balance.

The user can retrieve the list of her NFTs which will be listed down as token IDs. 

An NFT owner can create an auction by setting the NFT price (denominated in ether) to it which will act as a start price to the NFT auction.

A user/bidder can query the current list of auctions created so far which serve as an indicator to how many auctions were currently created. The first auction will be the auction number 0.

A bidder can bid on an auction by setting its auction number and a bid amount denominated in ether. If the bid amount is lower than the current bid or start price, an error message will appear. If the user wants to bid on the very first created auction, the auction number is 0.

An auctioneer can end an auction she previously created. If a user maliciously tries to end au auction she has not initially created, an error message will appear.

Bidders can either claim their winning NFT or loosing bids once the auction is over.
