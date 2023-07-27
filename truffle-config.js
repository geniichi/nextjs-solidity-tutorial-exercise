const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
module.exports = {
  networks: {
    inf_TaskProject_goerli: {
      network_id: 5,
      gasPrice: 1000000000,
      provider: new HDWalletProvider(fs.readFileSync('c:\\Users\\walter\\Desktop\\code-sample\\nextjs-solidity-tutorial\\server\\.env', 'utf-8'), "https://goerli.infura.io/v3/d78d5e9fb212414199cf90dcb1b415b9")
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.20"
    }
  }
};
