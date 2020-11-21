import React, { useState} from "react";
import { ethers } from 'ethers';
import "./Nav.css";

class Nav extends React.Component {
 state = { account: "" };

 async loadAccount() {
   if(window.ethereum) {
     await window.ethereum.enable();
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();
     const signerAddress = await signer.getAddress();
     this.setState({ account: signerAddress });
     //window.location.reload(false);
   }
}
   componentDidMount() {
   this.loadAccount();
 }

 render() {
   return (
      <div>
       Your connected address: {this.state.account}
      </div>
   );
 }
}

export default Nav;
