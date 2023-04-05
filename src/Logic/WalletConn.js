import Web3 from "web3";
//import WalletConnect from '@walletconnect/client';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },{
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}, {"name":"_spender","type":"address"}],
    "name":"allowance",
    "outputs":[{"name":"","type":"uint256"}],
    "type":"function"
  },{
    "constant":true,
    "inputs":[],
    "name":"totalSupply",
    "outputs":[{"name":"","type":"uint256"}],
    "type":"function"
  },{
    "constant":true,
    "inputs":[{"name":"spender","type":"address"}, {"name":"amount","type":"uint256"}],
    "name":"approve",
    "outputs":[{"name":"","type":"bool"}],
    "type":"function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  }, {
    "type": "event",
    "name": "Approval",
    "inputs": [{"name":"", "type":"address"}, {"name":"", "type":"address"}, {"name":"", "type":"uint256"}]
  }
];

const projectId = '4e1b2f2458a7012a97839e7ad3f9ba85';

export const getWeb3 = () => {
    const web3 = new Web3(Web3.givenProvider);
    return web3;
}

export const connect = (onConnected, onNetworkUpdate, onAccountUpdate) => {
    var ethereum;
    console.log("connecting", window.ethereum);
    if (typeof window.ethereum !== 'undefined'){
        ethereum = window.ethereum;

        ethereum.on('chainChanged', onNetworkUpdate)
        ethereum.on('accountsChanged', onAccountUpdate);
    } else {
      NotificationManager.error('No wallet to connect to. Install Metamask, please.');
      console.log("no metamask");
      //const bridge = "https://bridge.walletconnect.org";
      // create new connector
      /*const connector = new WalletConnect({ bridge });
      if (!connector.connected) {
        // create new session
        connector.createSession();
      }*/

      //ethereum = new Web3(JSONRPC_URL);
    }

    // Enable
    if (ethereum != null){
      ethereum.request({ method: 'eth_requestAccounts' }).then(x => {
        onConnected(ethereum);
      });
    }
}

export const disconnect = (ethereum) => {
    console.log("ethereum: " + ethereum);
    try {
      ethereum.disconnect();
    } catch (err) {
      if (ethereum !== null && ethereum.close){
        ethereum.close();
      }
    }
  }

export const getBalance = (web3, address, onBalanceUpdate) => {
    web3.eth.getBalance(address).then(x => 
      onBalanceUpdate(web3.utils.fromWei(x))
    );
  }

export const getBalanceOf = (web3, address, token, onBalanceUpdate) => {
    //alert("getBalanceOf - address: " + address + " token: " + token);
    console.log("getBalanceOf: address: " + address + " token: " + token);
    const contract = new web3.eth.Contract(minABI, token);
    contract.methods.balanceOf(address).call((err, balance) => {
      console.log("returned balance: " + balance);
      if (err){
        console.error(err);
      } else if (balance) {
        onBalanceUpdate(web3.utils.fromWei(String(balance)));
      } 
    });
  }
  
export const fixChecksumAddress = function (web3, address) {
  return address.length === 0 ? "" : web3.utils.toChecksumAddress(address.toString());
}

export const verifyAddress = (web3, address) => {
  return web3.utils.isAddress(address);
}

export const addChain = (ethereum, chainId, chainName, nativeCoinName, nativeCoinSymbol, rpcUrls, blockExplorers, onDone) => {
  if (ethereum === null){ return; }
  if (chainId === "1") {
    ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    }).then(x => {
      if (onDone) { onDone(); }
    });
    return;
  }
  ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [{
      chainId: "0x" + Number(chainId).toString(16), // A 0x-prefixed hexadecimal string
      chainName: chainName,
      nativeCurrency: {
        name: nativeCoinName,
        symbol: nativeCoinSymbol, // 2-6 characters long
        decimals: 18,
      },
      rpcUrls: rpcUrls, // string[];
      blockExplorerUrls: blockExplorers, // string[];
    }]
  }).then(x => {
    if (onDone){ onDone(); }
  });
}