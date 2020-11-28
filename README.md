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


## Running the project

#### First steps

1. Install NodeJS + npm from https://nodejs.org

2. Install the Truffle framework
```console
npm install -g truffle
```

3. Install ganache-cli
```console
npm install -g ganache-cli
```

4. Clone this repo
```console
git clone https://github.com/thibault23/auction-marketplace
```

#### DApp interaction

After cloning this repository, open 2 terminal windows and `cd` into the top directory of this project in both.
In the 1st window, run `ganache-cli` to start your local blockchain.

In the second window, run:

```console
truffle compile
```

then:

```console
truffle migrate --reset
```

Once the migration is complete, navigate to the frontend folder with `cd frontend` and run `npm start` for the application to start.
A window should automatically open to `localhost:3000`. If not, open your browser which uses MetaMask and enter `localhost:3000` as the URL.

Open Metamask, log out of any current account and restore a new account with the seed phrase that can be copied from the window where ganache-cli is currently running.

Once logged into Metamask, choose "Custom RPC" network and "http://127.0.0.1:8545" as New RPC URL. Click Save and make sure you are using the network defined just now.

Refresh the page once.

You should now be able to interact with the application. At least 3 accounts should be created to fully interact with the DApp.

#### Testing

You may also want to run the tests that were defined for this project.

To do so, you can open another command window and navigate to the top directory of this project.

There you can run:

```console
truffle test
```

All tests should be passed!

## Project Requirements

#### Smart Contract
- [x] Be a Truffle project

- [x] Have a smart contract(s) commented according to the specs which:

    - [x] Have a circuit breaker design pattern and at least one other design pattern in Module 10 Lesson 1

    - [x] Have security features to protect against at least two attack vectors outlined in Module 9 Lesson 3

    - [x] Use a library (SafeMath.sol, etc) or extend another contract

- [x] Have at least 5 tests for each smart contract

- [] Smart contract should be deployed to a testnet

#### Frontend
- [x] Have a development server to serve the frontend interaction of the application locally (You should be able to visit a local URL and interact with the application)

- [x] Frontend should work with web3.js / ethers.js, Infura and MetaMask to:

    - [x] Recognize and display current MM account

    - [x] Sign transactions that change a deployed contract’s state using MetaMask

    - [x] Reflect the successful state change in the UI


#### Git
- [x] Be uploaded to its own Github repository

- [x] Have a README doc describing the overview of your project, pointing out directory structure and how to build and run your project locally AND

- [x] A document called design_pattern_decisions.md explaining which design patterns you used AND

- [x] A document called avoiding_common_attacks.md explaining security steps you took what measures you took to ensure your contracts are not susceptible to common attacks AND

- [] A document called deployed_addresses.txt that describes where your contracts live (testnet AND address).

- [] A screen recording walking through your Dapp.
