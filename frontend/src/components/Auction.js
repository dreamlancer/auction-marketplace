import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import AuctionNft from '../contracts/AuctionNft.json';
import AuctionERC721 from '../contracts/AuctionERC721.json';


function Auction( {auctionNft, auctionERC721} ) {

  const [auction, setauction] = useState(0);
  const [visibleAuctions, setVisibleAuctions] = useState([]);
  const [bid, setBid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBid, setLoadingBid] = useState(false);
  const [detailAuction, setDetailAuction] = useState([]);
  //const [error, setError] = useState({});

  //useEffect(() => {

  const getAuction = async (t) => {

    if (auctionNft) {
     t.preventDefault();

     const numberOfAuctions = await auctionNft.getNumberOfAuctions();
     console.log(numberOfAuctions); //ok
     let items = [];
     for (let i =0; i < numberOfAuctions; i++) {

       const result = await auctionNft.getAuctionInfo(i);
       console.log(result);
       //setVisibleAuctions(result);
       items.push(parseInt(result));
    }

    setVisibleAuctions(items);
   }
   console.log(visibleAuctions);
   };
   //getAuction();
   //}, []);



   const getLatestAuction = async (t) => {

     if (auctionNft) {
      t.preventDefault();
      const result = await auctionNft.getAuctionInfo(auction);
      console.log(result);
      let items = [];
      for (let i = 0; i < result.length; i++) {
        items.push({id: parseInt(result[i])});
      }
      console.log(items);
      setDetailAuction(items);
      console.log(detailAuction);
    }

   };



  const bidAuction = async (t) => {
    if (auctionNft) {
      try {
         t.preventDefault();
         setLoadingBid(false);
         const accounts = await window.ethereum.enable();
         const account = accounts[0];
         const bidValue = await auctionNft.bidAuction(auction, {from: account, value: ethers.utils.parseEther(bid)});
       } catch {
         setLoadingBid(true);
       }
     }
  };

  const endAuction = async (t) => {
    if (auctionNft) {
     t.preventDefault();
     const accounts = await window.ethereum.enable();
     const account = accounts[0];
     const end = await auctionNft.endAuction(auction);
    }
  };

  const claimNft = async (t) => {
    if (auctionNft) {
      try {
         t.preventDefault();
         setLoading(false);
         //setError({});
         const accounts = await window.ethereum.enable();
         const account = accounts[0];
         //const approved = await auctionERC721.approve(account, 10);
         const claimN = await auctionNft.withdrawNft(auction);
       } catch {
        //setError(err);
        setLoading(true);
     }
   }
  };

  const claimBid = async (t) => {
    if (auctionNft) {
     t.preventDefault();
     const accounts = await window.ethereum.enable();
     const account = accounts[0];
     const claim = await auctionNft.withdrawBid(auction);
    }
  };


return(
  <div className="main">
  <div className="cargo">
    <div className="case">
        <button className="button" onClick={getAuction} type="button">
          Retrieve all Auctions
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
       <br>
       </br>
       <br>
       </br>
       <br>
       </br>


       <form className="form" onSubmit={getLatestAuction}>
             <label>
               Set the auction:
               <input
                 className="input"
                 type="text"
                 name="name"
                 onChange={(t) => setauction(t.target.value)}
               />
             </label>
             <button className="button" type="submit" value="Confirm">
               Retrieve latest auction details
             </button>
             <div className="result">
              {detailAuction.map(item => (
                <li
                  key={item.id}>{item.id}
                </li>
              ))}
             </div>
       </form>

       <br>
       </br>
       <br>
       </br>
       <br>
       </br>
       <br>
       </br>
       <br>
       </br>
       <br>
       </br>

       <div>
       {!loadingBid && (
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
        )}
        {loadingBid && <ErrorComponentBid></ErrorComponentBid>}
        </div>


        <form className="form" onSubmit={endAuction}>
              <button className="button" type="submit" value="Confirm">
                End an auction
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
          </form>

          <div>
          {!loading && (
          <form className="form" onSubmit={claimNft}>
                <button className="button" type="submit" value="Confirm">
                  Claim Nft
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
            </form>
            )}

            {loading && <ErrorComponent></ErrorComponent>}
            </div>

            <form className="form" onSubmit={claimBid}>
                  <button className="button" type="submit" value="Confirm">
                    Claim your bid
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
              </form>
    </div>
 </div>
 </div>
);

}

function ErrorComponentBid() {
  return <h1> Set higher Bid! </h1>
}

function ErrorComponent() {
  return <h1> NFT cannot be claimed </h1>
}

export default Auction;
