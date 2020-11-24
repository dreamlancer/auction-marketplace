import React, { useState } from 'react';
import { ethers, Contract } from 'ethers';
import "./Auction.css";
import AuctionNft from '../contracts/AuctionNft.json';
import AuctionERC721 from '../contracts/AuctionERC721.json';

function Auction({auctionNft, auctionERC721}) {
  const[price, setPrice] = useState(0);
  const[tokenid, setTokenId] = useState(0);

  const createNftAuction = async (t) => {
     t.preventDefault();
     const approved = await auctionERC721.approve(auctionNft.address, tokenid)
     const post = await auctionNft.createAuction(auctionERC721.address, price, tokenid);
};

  return(
    <div className="main">
    <div className="cargo">
      <div className="case">
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
      </div>
    </div>
    </div>
  );
}

export default Auction;
