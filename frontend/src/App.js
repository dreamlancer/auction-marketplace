import './App.css';
import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum.js';
import Auction from './components/Auction.js';
import Nav from './components/Nav.js';

function App() {
  const [auctionERC721, setAuctionERC721] = useState(undefined);
  const [auctionNft, setAuctionNft] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const { auctionERC721, auctionNft } = await getBlockchain();
      setAuctionERC721(auctionERC721);
      setAuctionNft(auctionNft);
    }
    init();
  }, []);

  if(typeof window.ethereum === 'undefined') {
    return (
      <div className='container'>
        <div className='col-sm-12'>
          <h1>NFT Auction Market</h1>
          <p>You need to install the latest version of Metamask</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      <Nav />
      <div className='col-sm-12'>
        <h1>NFT Auction Market</h1>
        <Auction auctionERC721={auctionERC721} />
      </div>
    </div>
  );
}

export default App;
