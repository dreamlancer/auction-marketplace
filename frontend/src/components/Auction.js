import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import AuctionNft from '../contracts/AuctionNft.json';


function Auction( {auctionNft} ) {

  const [auction, setauction] = useState(0);
  const [visibleAuctions, setVisibleAuctions] = useState([]);
  const [bid, setBid] = useState(0);


  //useEffect(() => {

  const getAuction = async (t) => {

    if (auctionNft) {
     t.preventDefault();

     const numberOfAuctions = await auctionNft.getNumberOfAuctions();
     console.log(numberOfAuctions); //ok
     let items = [];
     for (let i =0; i < numberOfAuctions; i++) {

       const result = await auctionNft.getAuctionInfo(i);
       items.push(parseInt(result));
    }

    setVisibleAuctions(items);
   }
   console.log(visibleAuctions);
   };
   //getAuction();
//}, []);
  const bidAuction = async (t) => {
    if (auctionNft) {
     t.preventDefault();
     const accounts = await window.ethereum.enable();
     const account = accounts[0];
     const bidValue = await auctionNft.bidAuction(auction, {from: account, value: ethers.utils.parseEther(bid)});
    }
  };

return(
  <div className="main">
  <div className="cargo">
    <div className="case">
        <button className="button" onClick={getAuction} type="button">
          Retrieve Auctions
        </button>

        <div className="result">

        {visibleAuctions}

        </div>
       <br>
       </br>
       <br>
       </br>
       <br>
       </br>
       <form className="form" onSubmit={bidAuction}>
             <button className="button" type="submit" value="Confirm">
               Bid an auction
             </button>
             <label>
               Set the auction number:
               <input
                 className="input"
                 type="text"
                 name="name"
                 onChange={(t) => setauction(t.target.value)}
               />
             </label>
             <label>
               Set your bid:
               <input
                 className="input"
                 type="text"
                 name="name"
                 onChange={(t) => setBid(t.target.value)}
               />
             </label>
        </form>
      </div>
 </div>
 </div>
);

}

export default Auction;
