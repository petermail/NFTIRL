import { Alchemy, Network } from 'alchemy-sdk';

const web3ApiKey = 'Yd4AgRAh1GDBL0ToVljpCGtSnaWLu9LpaBCm8yQdKfRn7nEKgIBbwLoZvqAOlUu8';
const alchemyApiKey = "81bLOeHHLypewF27GRdkijvOvjBldB5p";

const config = {
  apiKey: alchemyApiKey,
  network: Network.ETH_MAINNET
};
const alchemy = new Alchemy(config);

const options = {
  method: 'GET',
  params: {
    chain: '0x89',
  },
  headers: {
    accept: 'application/json',
    'X-API-Key': web3ApiKey
  }
};

var lastWallet = '';
export const getAllNftsAsync = async (address) => {
  if (address.length === 0) { return null; }
  if (lastWallet === address) { return null; }
  lastWallet = address;
  const nfts = await alchemy.nft.getNftsForOwner(address);
  return nfts;
}
export const getNft = (contract, tokenId, updateImage) => {
    contract = '0x2953399124F0cBB46d2CbACD8A89cF0599974963';
    tokenId = '113461209507512867518933452141320285231135646094834536306130710983923277496520';
    fetch('https://deep-index.moralis.io/api/v2/nft/'+contract+'/'+tokenId, options)
        .then((res) => { updateImage(res.json().image); })
        .then((data) => console.log(data));
}