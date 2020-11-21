import { ethers, Contract } from 'ethers';
import AuctionERC721 from './contracts/AuctionERC721.json';
import AuctionNft from './contracts/AuctionNft.json';


const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if(window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const auctionERC721 = new Contract(
          AuctionERC721.networks[window.ethereum.networkVersion].address,
          AuctionERC721.abi,
          signer
        );

        const auctionNft = new Contract(
          AuctionNft.networks[window.ethereum.networkVersion].address,
          AuctionNft.abi,
          signer
        );

        resolve({provider, auctionERC721, auctionNft});
      }
      resolve({provider: undefined, auctionERC721: undefined, auctionNft: undefined});
    });

  });
export default getBlockchain;
