const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

// allow access to React app domain
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

const web3ApiKey = 'Yd4AgRAh1GDBL0ToVljpCGtSnaWLu9LpaBCm8yQdKfRn7nEKgIBbwLoZvqAOlUu8';


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

var wasStarted = false;
export const getAllNftsAsync = async (address) => {
  if (!wasStarted) {
    await Moralis.start({ apiKey: web3ApiKey });
    wasStarted = true;

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }
  const chain = EvmChain.ETHEREUM;
  const response = await Moralis.EvmApi.nft.getWalletNFTs({ address, chain });
  console.log(response);
  return response?.result.toJSON();
}
export const getNft = (contract, tokenId, updateImage) => {
    contract = '0x2953399124F0cBB46d2CbACD8A89cF0599974963';
    tokenId = '113461209507512867518933452141320285231135646094834536306130710983923277496520';
    fetch('https://deep-index.moralis.io/api/v2/nft/'+contract+'/'+tokenId, options)
        .then((res) => { updateImage(res.json().image); })
        .then((data) => console.log(data));
}