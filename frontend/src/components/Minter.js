import React, { useState } from 'react';
import { ethers, Contract } from 'ethers';
import "./Minter.css";
import AuctionERC721 from '../contracts/AuctionERC721.json';

function Minter( {auctionERC721}) {

  const [address, sendToken] = useState(0);
  const [uri, setUri] = useState(0);
  //const [nftall, setAllNft] = useState([]);
  const [nfts, setGet] = useState(["your list of NFTs is..."]);

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
    let items = [];
    for (let i = 0; i < post.length; i++) {
      items.push({id: parseInt(post[i])});
    }
    console.log(post);
    console.log(items);
    setGet(items);
    //setGet(nfts => [...nfts, post]);
    console.log(nfts);
    //setAllNft(nftall.concat(post));
  };

 return(
   <div className="main">
   <div className="cargo">
     <div className="case">
       <form className="form" onSubmit={mintNft}>
             <label>
               Set the receiver:
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
               Mint and send NFT token
             </button>
       </form>
       <br />
           <button className="button" onClick={getNft} type="button">
             Retrieve all your NFTs
           </button>
           <div className="result">
            {nfts.map(item => (
              <li
                key={item.id}>{item.id}
              </li>
            ))}
           </div>
      </div>
    </div>
    </div>
  );
}

export default Minter;
