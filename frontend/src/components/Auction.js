import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import AuctionNft from '../contracts/AuctionNft.json';


function Auction( {auctionNft} ) {

  const [auction, setauction] = useState(0);
  const [visibleAuctions, setVisibleAuctions] = useState([]);

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
   </div>
 </div>
 </div>
);

};

export default Auction;
