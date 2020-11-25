import './App.css';
import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum.js';
import Minter from './components/Minter.js';
import Nav from './components/Nav.js';
import Auction from './components/Auction.js'
import { ethers, Contract } from 'ethers';

function App() {
  const [auctionERC721, setAuctionERC721] = useState(undefined);
  const [auctionNft, setAuctionNft] = useState(undefined);
  const[price, setPrice] = useState(0);
  const[tokenid, setTokenId] = useState(0);

  useEffect(() => {
    const init = async () => {
      const { auctionERC721, auctionNft } = await getBlockchain();
      setAuctionERC721(auctionERC721);
      setAuctionNft(auctionNft);
    }
    init();
  }, []);

  const createNftAuction = async (t) => {
     t.preventDefault();
     await window.ethereum.enable();
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();

     const approved = await auctionERC721.approve(auctionNft.address, tokenid)
     const post = await auctionNft.createAuction(auctionERC721.address, price, tokenid);
};

  if(typeof window.ethereum === 'undefined') {
    return (
      <div className='container'>
        <div className='col-sm-12'>
          <h1>NFT Auction Marketplace</h1>
          <p>You need to install the latest version of Metamask</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      <Nav auctionERC721={auctionERC721} />
      <div className='col-sm-12'>
        <h1>NFT Auction Marketplace</h1>
        <Minter auctionERC721={auctionERC721} />

        <form className="form" onSubmit={createNftAuction}>
              <label>
                Set the price:
                <input
                  className="input"
                  type="text"
                  name="name"
                  onChange={(t) => setPrice(t.target.value)}
                />
              </label>
              <label>
                Token Id to auction:
                <input
                  className="input"
                  type="text"
                  name="name"
                  onChange={(t) => setTokenId(t.target.value)}
                />
              </label>
              <button className="button" type="submit" value="Confirm">
                Create an auction
              </button>
        </form>
        <Auction auctionNft={auctionNft} />
      </div>
    </div>
  );
}

export default App;
