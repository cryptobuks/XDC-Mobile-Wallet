import Config from 'react-native-config';
import EthereumJsWallet from 'ethereumjs-wallet';
import Web3 from 'web3';
import EthereumTx from 'ethereumjs-tx';
import ProviderEngine from 'web3-provider-engine';
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet';
import ProviderSubprovider from 'web3-provider-engine/subproviders/provider';
// import Passport from 'passport';
// import googleStrategy from 'passport-google-oauth20';
import { store } from '../config/store';
import contractAbi from './XDCAbi';
import {
  ADD_TOKEN,
  SET_WALLET_ADDRESS,
  SET_PRIVATE_KEY,
} from '../config/actionTypes';
import AnalyticsUtils from './analytics';
import { erc20Abi } from './constants';

export default class WalletUtils {
  /**
   * Given an EthereumJSWallet instance, store both address and private key
   * in Redux store
   *
   * @param {Object} wallet
   */
  static storeWallet(wallet) {
    store.dispatch({
      type: SET_WALLET_ADDRESS,
      walletAddress: wallet.getAddressString(),
    });

    store.dispatch({
      type: SET_PRIVATE_KEY,
      privateKey: wallet.getPrivateKey().toString('hex'),
    });
  }

  /**
   * Generate an Ethereum wallet
   */
  static generateWallet() {
    const wallet = EthereumJsWallet.generate();

    AnalyticsUtils.trackEvent('Generate wallet', {
      walletAddress: wallet.getAddressString(),
    });

    this.storeWallet(wallet);
  }

  /**
   * Store a wallet in Redux store given a private key
   *
   * @param {String} privateKey
   */
  static restoreWallet(privateKey) {
    const wallet = EthereumJsWallet.fromPrivateKey(
      Buffer.from(privateKey, 'hex'),
    );

    AnalyticsUtils.trackEvent('Import wallet', {
      walletAddress: wallet.getAddressString(),
    });

    this.storeWallet(wallet);
  }

  /**
   * Reads an EthereumJSWallet instance from Redux store
   */
  static getWallet() {
    const { privateKey } = store.getState();

    return EthereumJsWallet.fromPrivateKey(Buffer.from(privateKey, 'hex'));
  }

  static getWeb3HTTPProvider() {
    switch (store.getState().network) {
      default:
        return new Web3.providers.HttpProvider(
          "https://ropsten.infura.io/v3/f060477f35da4c4b85e403b978b17d55"
          );
    }
  }

  static getEtherscanApiSubdomain() {
    switch (store.getState().network) {
      default:
        return 'api';
    }
  }

  /**
   * Returns a web3 instance with the user's wallet
   */
  static getWeb3Instance() {
    const wallet = this.getWallet();

    const engine = new ProviderEngine();

    engine.addProvider(new WalletSubprovider(wallet, {}));
    engine.addProvider(new ProviderSubprovider(this.getWeb3HTTPProvider()));

    engine.start();

    const web3 = new Web3(engine);

    web3.eth.defaultAccount = wallet.getAddressString();

    return web3;
  }

  /**
   * Load the tokens the user owns
   */
  static loadTokensList() {
    const { availableTokens, network, walletAddress } = store.getState();

    if (network !== 'mainnet') return Promise.resolve();

    const availableTokensAddresses = availableTokens
      .filter(token => token.symbol !== 'XDC')
      .map(token => token.contractAddress);

    return fetch(
      `https://api.ethplorer.io/getAddressInfo/${walletAddress}?apiKey=freekey`,
    )
      .then(response => response.json())
      .then(data => {
        if (!data.tokens) {
          return Promise.resolve();
        }

        return data.tokens
          .filter(
            token =>
              !availableTokensAddresses.includes(token.tokenInfo.address),
          )
          .forEach(token => {
            store.dispatch({
              type: ADD_TOKEN,
              token: {
                contractAddress: token.tokenInfo.address,
                decimals: parseInt(token.tokenInfo.decimals, 10),
                name: token.tokenInfo.name,
                symbol: token.tokenInfo.symbol,
              },
            });
          });
      });
  }

  /**
   * Fetch a list of transactions for the user's wallet concerning the given token
   *
   * @param {Object} token
   */
  static getTransactions({ contractAddress, decimals, symbol }) {
    return this.getERC20Transactions(contractAddress, decimals);
  }

  /**
   * Fetch a list of a given token transactions for the user's wallet
   *
   * @param {String} contractAddress
   */
  static async getERC20Transactions(contractAddress, decimals) {
    const { walletAddress } = store.getState();

    return fetch(
      `https://${this.getEtherscanApiSubdomain()}.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${walletAddress}&sort=desc&apikey=${
      Config.ETHERSCAN_API_KEY
      }`,
    )
      .then(response => response.json())
      .then(data => {
        if (data.message !== 'OK') {
          return [];
        }

        return data.result.map(t => ({
          from: t.from,
          timestamp: t.timeStamp,
          transactionHash: t.hash,
          value: (parseInt(t.value, 10) / Math.pow(10, decimals)).toFixed(2),
        }));
      });
  }


  /**
   * Google Sign in
   *
   * 
   */
  static OAuthSignIn() {

  }

  /**
   * Get the user's wallet balance of a given token
   *
   * @param {Object} token
   */
  static getBalance({contractAddress, symbol, decimals}) {
    console.log('2', contractAddress);
    console.log('3', decimals);
    if (symbol === 'XDC') {
      return this.getERC20Balance(contractAddress, decimals);
    }
  }

  /**
   * Get the user's wallet ETH balance
   */
  static getERC20Balance(contractAddress, decimals) {

    const { walletAddress, privateKey } = store.getState();
    console.log('walletAddress', walletAddress)
    console.log('privateKey', privateKey)
    const web3 = new Web3(this.getWeb3HTTPProvider());

    return new Promise((resolve, reject) => {
      var MyContract = web3.eth.contract(contractAbi);
      web3.eth.getBalance(walletAddress, function(e, r) {
        console.log('getbalance eth', r);
        console.log('getbalance ree', r / Math.pow(10, 18));
      });
      var instancecontract = MyContract.at(contractAddress);
      // console.log(instancecontract.name(function(res, err) {
      //   console.log('res', res);
      //   console.log('error', err);
      // }));
      instancecontract.balanceOf(walletAddress, function (error, weiBalance) {
        console.log('getbalance p', weiBalance);
        console.log('getbalance r', weiBalance / Math.pow(10, 18));
        if (error) {
          reject(error);
        }

        const balance = weiBalance / Math.pow(10, 18);

        AnalyticsUtils.trackEvent('Get ETH balance', {
          balance,
        });

        resolve(balance);
      });


    });
  }

  /**
   * Send a transaction from the user's wallet
   *
   * @param {Object} token
   * @param {String} toAddress
   * @param {String} amount
   */
  static sendTransaction(
    { contractAddress, symbol, decimals },
    toAddress,
    amount,
  ) {
    if (symbol === 'XDC') {
      return this.sendETHTransaction(toAddress, amount);
    }

    return this.sendERC20Transaction(
      contractAddress,
      decimals,
      toAddress,
      amount,
    );
  }


  /**
   * Send an ETH transaction to the given address with the given amount
   *
   * @param {String} toAddress
   * @param {String} amount
   */
  static sendETHTransaction(toAddress, amount) {
    const { walletAddress, privateKey } = store.getState();
    const web3 = this.getWeb3Instance();

    AnalyticsUtils.trackEvent('Send ETH transaction', {
      value: amount,
    });

    return new Promise((resolve, reject) => {
      web3.eth.getTransactionCount(walletAddress, function (error, data) {
        console.log('data:::', data);
        const txParams = {
          nonce: data,
          chainID: 3,
          gasPrice: '0x04e3',
          gasLimit: '0x1358E',
          to: contractAddress,
          data: web3.eth.contract(contractAbi).
            at(contractAddress)
            .transfer.getData(toAddress, amount, { from: walletAddress })
        }

        const tx = new EthereumTx(txParams)

        console.log('tx:::', tx);
        tx.sign(Buffer.from(privateKey, 'hex'));
        const serializedTx = tx.serialize();
        console.log('serial', serializedTx);
        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
          if (!err) {
            console.log('hash', hash);
            resolve(hash);
          } else {
            console.log('err', err);
            reject(err);
          }
        });

      });
    });

    // return new Promise((resolve, reject) => {
    //   web3.eth.sendTransaction(
    //     {
    //       to: toAddress,
    //       value: web3.toWei(amount),
    //     },
    //     (error, transaction) => {
    //       if (error) {
    //         reject(error);
    //       }

    //       resolve(transaction);
    //     },
    //   );
    // });
  }

  /**
   * Send an ETH transaction to the given address with the given amount
   *
   * @param {String} toAddress
   * @param {String} amount
   */
  static sendERC20Transaction(contractAddress, decimals, toAddress, amount) {
    const web3 = this.getWeb3Instance();

    AnalyticsUtils.trackEvent('Send ERC20 transaction', {
      contractAddress,
      value: amount,
    });

    // let data = web3.eth.contract(erc20Abi).
    //               at("0x7b7b74e20ed121058ffb5ede69346b9f729a7cab")
    //               .transfer(toAddress, amount * Math.pow(10, decimals)
    // let  obj1 = {
    //     nonce: "",
    //     gas: 470000,
    //     data: 
    //   }

    return new Promise((resolve, reject) => {

      web3.eth
        .contract(erc20Abi)
        .at(contractAddress)
        .transfer(
          toAddress,
          amount * Math.pow(10, decimals),
          (error, transaction) => {
            if (error) {
              reject(error);
            }

            resolve(transaction);
          },
        );
    });
  }
}
