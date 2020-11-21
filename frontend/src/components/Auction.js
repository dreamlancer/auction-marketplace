import React, { useState } from 'react';
import { ethers } from 'ethers';


function Auction( {auctionERC721}) {

  const [address, sendToken] = useState(0);
  const [uri, setUri] = useState(0);
  //const [nftall, setAllNft] = useState([]);
  const [nft, setGet] = useState([]);

  const mintNft = async (t) => {
   t.preventDefault();
   const accounts = await window.ethereum.enable();
   const account = accounts[0];
   const gas = await auctionERC721.estimateGas.addNewToken(address, uri);
   const post = await auctionERC721.addNewToken(address, uri);

 };

 const getNft = async (t) => {
    t.preventDefault();
    const post = await auctionERC721.getTokenCreators();
    setGet(parseInt(post));
    //setAllNft(nftall.concat(post));
  };

 return(
   <div className="cargo">
     <div className="case">
       <form className="form" onSubmit={mintNft}>
             <label>
               Set your address:
               <input
                 className="input"
                 type="text"
                 name="name"
                 onChange={(t) => sendToken(t.target.value)}
               />
             </label>
             <label>
               Set your URI:
               <input
                 className="input"
                 type="text"
                 name="name"
                 onChange={(t) => setUri(t.target.value)}
               />
             </label>
             <button className="button" type="submit" value="Confirm">
               Mint token
             </button>
       </form>
       <br />
           <button className="button" onClick={getNft} type="button">
             Retrieve
           </button>
           <div className="result">{nft}</div>
    </div>
      </div>
  );
}

export default Auction;
