import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import "./Nav.css";
import AuctionERC721 from '../contracts/AuctionERC721.json';

function Nav ({auctionERC721}){

 const [address, giveAddress] = useState(0);
 const [balance, giveBalance] = useState(0);

 useEffect(() => {
   const init = async () => {
     await window.ethereum.enable();
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();
     const signerAddress = await signer.getAddress();
     giveAddress(signerAddress);
     //window.location.reload(false);
   }
   init();
 }, []);

 const getBalance = async (t) => {
    t.preventDefault();
    const post = await auctionERC721.getBalance();
    giveBalance(parseInt(post));
 };


   return (
      <div className="container">
        <p>Your current address: {address}</p>
        <br />
            <button className="button" onClick={getBalance} type="button">
              NFT balance
            </button>
            <div className="result">
             {balance}
            </div>
      </div>
   );
}

export default Nav;
