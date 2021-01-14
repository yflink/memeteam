import config from "../config";
import async from 'async';
import bigInt from 'big-integer';
import Web3 from 'web3';
import {
  getVoterCount
} from '../web3/etherscan';

import {
  CLAIM,
  CLAIM_RETURNED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  ERROR,
  EXIT,
  EXIT_RETURNED,
  GET_BALANCES,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED,
  GET_BALANCES_RETURNED,
  GET_CLAIMABLE,
  GET_CLAIMABLE_ASSET,
  GET_CLAIMABLE_ASSET_RETURNED,
  GET_CLAIMABLE_RETURNED,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  GET_GOV_REQUIREMENTS,
  GET_GOV_REQUIREMENTS_RETURNED,
  PROPOSE,
  PROPOSE_RETURNED,
  PROPOSE_CONFIRMED,
  STAKE,
  STAKE_RETURNED,
  STAKE_CONFIRMED,
  VOTE_AGAINST,
  VOTE_AGAINST_RETURNED,
  VOTE_FOR,
  VOTE_FOR_RETURNED,
  VOTE_FOR_CONFIRMED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  POOL_INDEX_FOR_MEME,
  POOL_INDEX_FOR_CHAIN,
  APPROVE,
  APPROVE_RETURNED,
  NOW_TIMESTAMP_UPDATED,
  GET_LEADERBOARD,
  GET_LEADERBOARD_RETURNED
} from '../web3/constants';
import { getTransactionsForContract } from '../web3/etherscan';

import {
  authereum,
  fortmatic,
  frame,
  injected,
  ledger,
  portis,
  squarelink,
  torus,
  trezor,
  walletconnect,
  walletlink
} from "../web3/connectors";
import { campaignConfig } from "../campaign.config";
import { getRoundedWei } from "../web3/utils";

const rp = require('request-promise');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      currentBlock: 0,
      universalGasPrice: '70',
      account: {},
      web3: null,
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        Ledger: ledger,
        Trezor: trezor,
        Frame: frame,
        Fortmatic: fortmatic,
        Portis: portis,
        Squarelink: squarelink,
        Torus: torus,
        Authereum: authereum
      },
      web3context: null,
      languages: [
        {
          language: 'English',
          code: 'en'
        },
        {
          language: 'Japanese',
          code: 'ja'
        },
        {
          language: 'Chinese',
          code: 'zh'
        }
      ],
      proposals: [],
      leaderboard: [],
      // claimableAsset: {
      //   id: 'YFL',
      //   name: 'YFLink',
      //   address: config.yflAddress,
      //   abi: config.yflABI,
      //   symbol: 'YFL',
      //   balance: 0,
      //   decimals: 18,
      //   rewardAddress: '0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d',
      //   rewardSymbol: 'aDAI',
      //   rewardDecimals: 18,
      //   claimableBalance: 0
      // },
      rewardPools: [
        {
          id: 'pool0',
          title: 'Pool 0',
          name: 'LINK',
          website: 'ChainLink Token',
          link: 'https://etherscan.io/token/' + config.pool0StakeAddress,
          instructionsLink: 'https://gov.yflink.io/t/mining-yfl-in-pool-0-link/24',
          // yieldCalculator: "https://yieldfarming.yflink.io/yflink/pool0",
          depositsEnabled: true,
          tokens: [
            {
              id: 'link',
              address: config.pool0StakeAddress,
              symbol: 'LINK',
              abi: config.erc20ABI,
              rewardsAddress: config.pool0Address,
              rewardsABI: config.pool0ABI,
              rewardsSymbol: 'YFL',
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
        {
          id: 'pool1',
          title: 'Pool 1',
          name: 'LINK/YFL Balancer',
          website: 'Balancer Pool',
          link: 'https://pools.balancer.exchange/#/pool/' + config.pool1StakeAddress,
          instructionsLink: 'https://gov.yflink.io/t/mining-yfl-in-pool-1-link-yfl-balancer/25',
          // yieldCalculator: "https://yieldfarming.yflink.io/yflink/pool1",
          depositsEnabled: true,
          tokens: [
            {
              id: 'bpt',
              address: config.pool1StakeAddress,
              symbol: 'BPT',
              abi: config.erc20ABI,
              rewardsAddress: config.pool1Address,
              rewardsABI: config.pool1ABI,
              rewardsSymbol: 'YFL',
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
        {
          id: 'gov',
          title: 'Gov',
          name: 'Governance',
          website: 'YFLINK Token',
          link: 'https://yflink.io',
          instructionsLink: 'https://gov.yflink.io/t/staking-in-the-governance-contract/28',
          depositsEnabled: true,
          tokens: [
            {
              id: 'yfl',
              address: config.yflAddress,
              symbol: 'YFL',
              abi: config.yflABI,
              rewardsAddress: config.governanceAddress,
              rewardsABI: config.governanceABI,
              rewardsSymbol: null, // No rewards
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
        {
          id: 'pool2',
          title: 'Pool 2',
          name: 'yCRV/YFL Balancer',
          website: 'Balancer Pool',
          link: 'https://pools.balancer.exchange/#/pool/' + config.pool2StakeAddress,
          instructionsLink: 'https://gov.yflink.io/t/mining-yfl-in-pool-2-ycrv-yfl-balancer/26',
          yieldCalculator: "https://yieldfarming.yflink.io/yflink/pool2",
          depositsEnabled: true,
          startDate: config.pool2StartDate,
          tokens: [
            {
              id: 'bpt',
              address: config.pool2StakeAddress,
              symbol: 'BPT',
              abi: config.erc20ABI,
              rewardsAddress: config.pool2Address,
              rewardsABI: config.pool2ABI,
              rewardsSymbol: 'YFL',
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
        {
          id: 'pool3',
          title: 'Pool 3',
          name: 'aLINK/YFL Balancer',
          website: 'Balancer Pool',
          link: 'https://pools.balancer.exchange/#/pool/' + config.pool3StakeAddress,
          instructionsLink: 'https://gov.yflink.io/t/mining-yfl-in-pool-3-alink-yfl-balancer/27',
          yieldCalculator: "https://yieldfarming.yflink.io/yflink/pool3",
          depositsEnabled: true,
          startDate: config.pool3StartDate,
          tokens: [
            {
              id: 'bpt',
              address: config.pool3StakeAddress,
              symbol: 'BPT',
              abi: config.erc20ABI,
              rewardsAddress: config.pool3Address,
              rewardsABI: config.pool3ABI,
              rewardsSymbol: 'YFL',
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
        {
          id: 'govrewards',
          title: 'Gov Rewards',
          name: 'Governance + Rewards',
          website: 'YFLINK Token',
          link: 'https://yflink.io',
          instructionsLink: 'https://gov.yflink.io/t/mining-yfl-in-the-governance-rewards-contract/29',
          // yieldCalculator: 'https://yieldfarming.yflink.io/yflink/govrewards',
          depositsEnabled: true,
          startDate: config.governanceRewardsStartDate,
          tokens: [
            {
              id: 'yfl',
              address: config.yflAddress,
              symbol: 'YFL',
              abi: config.yflABI,
              rewardsAddress: config.governanceRewardsAddress,
              rewardsABI: config.governanceRewardsABI,
              rewardsSymbol: 'YFL',
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
      ]
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload);
            break;
          case GET_BALANCES:
            this.getBalances(payload);
            break;
          case GET_BALANCES_PERPETUAL:
            this.getBalancesPerpetual(payload);
            break;
          case APPROVE:
            this.approve(payload);
            break;
          case STAKE:
            this.stake(payload);
            break;
          case WITHDRAW:
            this.withdraw(payload);
            break;
          case GET_REWARDS:
            this.getReward(payload);
            break;
          case EXIT:
            this.exit(payload);
            break;
          case PROPOSE:
            this.propose(payload)
            break;
          case GET_PROPOSALS:
            this.getProposals(payload)
            break;
          case GET_LEADERBOARD:
            this.getLeaderBoard(payload)
            break;
          case VOTE_FOR:
            this.voteFor(payload)
            break;
          case VOTE_AGAINST:
            this.voteAgainst(payload)
            break;
          case GET_CLAIMABLE_ASSET:
            this.getClaimableAsset(payload)
            break;
          case CLAIM:
            this.claim(payload)
            break;
          case GET_CLAIMABLE:
            this.getClaimable(payload)
            break;
          case GET_GOV_REQUIREMENTS:
            this.getGovRequirements(payload)
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  hasEnoughYFL = () => {
    const token = store.getYFLToken();
    if (!token) {
      return false;
    }

    return token.balance >= store.getMinYFLToStakeToMinUnit();
  }

  stakedEnoughYFL = () => {
    const token = store.getYFLToken();
    if (!token) {
      return false;
    }

    return token.stakedBalance >= store.getMinYFLToStakeToMinUnit();
  }

  getYFLToken = () => {
    const rewardPools = this.getStore('rewardPools')
    const currentPool = rewardPools[POOL_INDEX_FOR_MEME];
    return currentPool.tokens[0];
  }

  getMinYFLToStakeToMinUnit = () => {
    const currentPool = this.getYFLToken();
    return  bigInt((0.1 * 10**currentPool.decimals).toString())
  }

  getCreatingMemeLink = () => {
    const title = this.getStore('creatingMemeTitle');
    const url = this.getStore('creatingMemeLink');
    let memeLink = `${url}?type=meme&campaign=${escape(campaignConfig.currentCampaign)}`;
    if (campaignConfig.isTest) {
      memeLink = `${memeLink}&isTest=true`
    }
    if (title) {
      memeLink = `${memeLink}&title=${title}`
    }
    return memeLink;
  }

  getYFLToken = () => {
    const rewardPools = this.getStore('rewardPools')
    const currentPool = rewardPools[POOL_INDEX_FOR_MEME];
    return currentPool.tokens[0];
  }

  getChainToken = () => {
    const rewardPools = this.getStore('rewardPools')
    const currentPool = rewardPools[POOL_INDEX_FOR_CHAIN];
    return currentPool.tokens[0];
  }

  MIN_YFL_TO_STAKE = 0.1

  getParsedMeme = (proposal, index) => {
    const { url, proposer, totalForVotes, totalAgainstVotes, start, end, displayName } = proposal;
    try {
      const { searchParams } = new URL(url);
      
      const type = searchParams.get('type');
      const isTest = searchParams.get('isTest') === "true";
      const title = searchParams.get('title');
      const campaign = searchParams.get('campaign');
      if (type !== 'meme') {
        return null;
      }

      if (campaignConfig.isTest !== isTest) {
        return null;
      }

      return {
        id: index,
        link: url.split("?")[0],
        title,
        isTest,
        proposer,
        totalForVotes,
        totalAgainstVotes,
        start,
        end,
        campaign: unescape(campaign),
        displayName
      };
    } catch (err) {
      // console.error(err);
      // console.log('-------failed to parse meme-----', proposal);
      return null;
    }
  }

  getMemes = () => {
    const proposals = this.getStore('proposals');
    const memes = proposals.map(this.getParsedMeme).filter(Boolean);
    return memes.filter(meme => getRoundedWei(meme.totalAgainstVotes) < 21);
  }

  getMemeForId = (id) => {
    const memes = this.getMemes();
    return memes && memes.find(m => '' + m.id === '' + id)
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    return emitter.emit('StoreUpdated');
  };

  configure = async () => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const currentBlock = await web3.eth.getBlockNumber()

    store.setStore({ currentBlock })

    window.setTimeout(() => {
      emitter.emit(CONFIGURE_RETURNED)
    }, 100)
  }

  getBalancesPerpetual = async () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const currentBlock = await web3.eth.getBlockNumber()
    store.setStore({ currentBlock })

    async.map(pools, (pool, callback) => {
      async.map(pool.tokens, (token, callbackInner) => {
        async.parallel([
          (callbackInnerInner) => {this._getERC20Balance(web3, token, account, callbackInnerInner)},
          (callbackInnerInner) => {this._getstakedBalance(web3, token, account, callbackInnerInner)},
          (callbackInnerInner) => {this._getRewardsAvailable(web3, token, account, callbackInnerInner)}
        ], (err, data) => {
          if (err) {
            console.log(err)
            return callbackInner(err)
          }

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if (err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })
    }, (err, poolData) => {
      if (err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_PERPETUAL_RETURNED)
      emitter.emit(GET_BALANCES_RETURNED)
      store.resetTimer();
    })
  }

  resetTimer = () => {
    let now = store.getStore('currentBlock')
    store.setStore({ now })

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timer = setInterval(this.updateNow, 1000);
  }

  updateNow = () => {
    let now = store.getStore('now')
    store.setStore({ now: now + 1 / 13.8 });
    emitter.emit(NOW_TIMESTAMP_UPDATED);
  }

  getBalances = async () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const currentBlock = await web3.eth.getBlockNumber()
    store.setStore({ currentBlock })

    async.map(pools, (pool, callback) => {
      async.map(pool.tokens, (token, callbackInner) => {
        async.parallel([
          (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) }
        ], (err, data) => {
          if(err) {
            console.log(err)
            return callbackInner(err)
          }

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if(err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_RETURNED)
      store.resetTimer();
    })
  }

  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);
      const erc20Contract = new web3.eth.Contract(asset.abi, asset.address)

      if (!erc20Contract.methods.allowance) {
        return callback() // Doesn't need approval
      }
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      if(bigInt(allowance).lesser(amount)) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      console.log(error)
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _approveIfNeeded = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);
      const erc20Contract = new web3.eth.Contract(asset.abi, asset.address)
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      if(bigInt(allowance).lesser(amount)) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      console.log(error)
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _getERC20Balance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)
    try {
      let balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      callback(null, bigInt(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getstakedBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    try {
      let balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      callback(null, bigInt(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getRewardsAvailable = async (web3, asset, account, callback) => {
    if (!asset.rewardsSymbol) {
      callback(null, bigInt(0))
      return
    }
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    try {
      let earned = await erc20Contract.methods.earned(account.address).call({ from: account.address });
      callback(null, bigInt(earned))
    } catch(ex) {
      return callback(ex)
    }
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    if(bigInt(allowance).lesser(amount)) {
      asset.amount = amount
      callback(null, asset)
    } else {
      callback(null, false)
    }
  }

  _callApproval = async (asset, account, amount, contract, last, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    try {
      if(last) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', function(_hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  approve = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._approveIfNeeded(asset, account, amount, asset.rewardsAddress, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(APPROVE_RETURNED, res)
    })
  }

  checkApproval = async (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);
      const erc20Contract = new web3.eth.Contract(asset.abi, asset.address)
      const allowance = await erc20Contract.methods.allowance(account.address, asset.rewardsAddress).call({ from: account.address })

      if(bigInt(allowance).lesser(amount)) {
        return false;
      } else {
        return true;
      }
    } catch(error) {
      return false;
    }
  }


  stake = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._checkApproval(asset, account, amount, asset.rewardsAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callStake(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }
  
        return emitter.emit(STAKE_RETURNED, res)
      },
      () => {
        emitter.emit(STAKE_CONFIRMED);
      })
    })
  }

  _callStake = async (asset, account, amount, callback, confirmationCallback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const rewardsContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    rewardsContract.methods.stake(amount.toString()).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        confirmationCallback();
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  withdraw = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callWithdraw(asset, account, amount, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(WITHDRAW_RETURNED, res)
    })
  }

  _callWithdraw = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const rewardsContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    rewardsContract.methods.withdraw(amount.toString()).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getReward = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callGetReward(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(GET_REWARDS_RETURNED, res)
    })
  }

  _callGetReward = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const rewardsContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    rewardsContract.methods.getReward().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  exit = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callExit(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(EXIT_RETURNED, res)
    })
  }

  _callExit = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const rewardsContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    rewardsContract.methods.exit().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  propose = (payload) => {
    const account = store.getStore('account')
    const { url } = payload.content

    this._callPropose(
      account,
      url,
      (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(PROPOSE_RETURNED, res)
      },
      () => {
        emitter.emit(PROPOSE_CONFIRMED)
      }
    )
  }

  _callPropose = async (account, url, callback, confirmationCallback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const governanceContract = new web3.eth.Contract(config.governanceABI, config.governanceAddress)
    const call = governanceContract.methods.propose(url)

    call.send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        confirmationCallback();
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getProposals = (_payload) => {
    // emitter.emit(GET_PROPOSALS_RETURNED)
    const account = store.getStore('account')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    this._getProposalCount(web3, account, (err, proposalCount) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      let arr = Array.from(Array(parseInt(proposalCount)).keys())

      if(proposalCount === 0) {
        arr = []
      }



      async.map(arr, (proposal, callback) => {
        this._getProposals(web3, account, proposal, callback)
      }, async (err, proposalsData) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        store.setStore({ proposals: proposalsData })
        emitter.emit(GET_PROPOSALS_RETURNED)
      })
    })
  }

  getLeaderBoard = (_payload) => {
    
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const memes = this.getMemes();

    async.map(memes, (meme, callback) => {
        this._getLeaderBoardData(web3, meme, callback);
    }, async(err, leaderboardData) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }
      console.log(leaderboardData);
      leaderboardData.sort(function(a, b) {
        return b.score - a.score; 
      })
  
      store.setStore({ leaderboard: leaderboardData })
      emitter.emit(GET_LEADERBOARD_RETURNED);
      console.log("Rank  Post ID          Poster                               Votes For   Votes Against          Adj. Factor   Score")
      for(var i = 0; i < leaderboardData.length; i++) {
        console.log(
          i+1+"     ",
          leaderboardData[i].id+"    ",
          leaderboardData[i].poster+ "  ",
          leaderboardData[i].votesFor+ "  ",
          leaderboardData[i].votesAgainst+ "  ",
          leaderboardData[i].voters+ "  ",
          leaderboardData[i].factor+ "  ",
          leaderboardData[i].score
        )
      }
    })
  }

  
  _getLeaderBoardData = async (web3, meme, callback) => {
      let element = new Object();
      element['id'] = meme.id;
      element['votesFor'] = web3.utils.fromWei(meme.totalForVotes, 'ether');
      element['votesAgainst'] = web3.utils.fromWei(meme.totalAgainstVotes, 'ether');
      element['poster'] = meme.proposer;
      element['voters'] = await getVoterCount(meme.id);
      let memeScore = 0;
      let voteAdjustmentFactor = 0;

      if (Number(element['voters']) >= Number(element['votesFor'])) {
        memeScore = Number(element['voters']) + Number(element['votesFor'])
      }
      else {
        const score = this._calculateMemeScore(Number(element['voters']), Number(element['votesFor']))
        memeScore = score.score;
        voteAdjustmentFactor = score.voteAdjustmentFactor;
      }

      element['score'] = memeScore;
      element['factor'] = voteAdjustmentFactor;
      callback(null, element)
  }

  _calculateMemeScore = (voters, votes) => {
    const voteAdjustmentFactor = (Math.pow(2 * (votes * voters) / ( votes + voters), 2)) / ( votes * voters );
    const score = voteAdjustmentFactor * votes + voters;

    return {voteAdjustmentFactor, score};
  }

  _getProposalCount = async (web3, account, callback) => {
    try {
      const governanceContract = new web3.eth.Contract(config.governanceABI, config.governanceAddress)
      let proposals = await governanceContract.methods.proposalCount().call({ from: account.address });
      callback(null, proposals)
    } catch(ex) {
      return callback(ex)
    }
  }

  _getProposals = async (web3, account, number, callback) => {
    try {
      const governanceContract = new web3.eth.Contract(config.governanceABI, config.governanceAddress)
      const wns = new web3.eth.Contract(config.wnsABI, config.wnsAddress)
      
      
      let proposal = await governanceContract.methods.proposals(number).call({ from: account.address });
      let handleInfos = await  wns.getPastEvents("NewHandle", {
        filter: {owner: proposal.proposer},
        fromBlock: 11456097,
        toBlock: 'latest'
      });
      let displayName = undefined;
      if(handleInfos.length > 0) {
        displayName = handleInfos[0].returnValues.handle;
        console.log(displayName)
      }


      proposal.displayName = displayName;
      callback(null, proposal)
    } catch(ex) {
      return callback(ex)
    }
  }

  voteFor = (payload) => {
    const account = store.getStore('account')
    const { proposal } = payload.content

    this._callVoteFor(proposal, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(VOTE_FOR_RETURNED, {
        hash: res,
        proposal,
      })
    },
    () => {
      emitter.emit(VOTE_FOR_CONFIRMED, {
        proposal,
      });
    })
  }

  _callVoteFor = async (proposal, account, callback, confirmationCallback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const governanceContract = new web3.eth.Contract(config.governanceABI, config.governanceAddress)

    governanceContract.methods.voteFor(proposal.id).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log('receipt', receipt);
        confirmationCallback();
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  voteAgainst = (payload) => {
    const account = store.getStore('account')
    const { proposal } = payload.content

    this._callVoteAgainst(proposal, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(VOTE_AGAINST_RETURNED, res)
    })
  }

  _callVoteAgainst = async (proposal, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const governanceContract = new web3.eth.Contract(config.governanceABI, config.governanceAddress)

    governanceContract.methods.voteAgainst(proposal.id).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
          dispatcher.dispatch({ type: GET_LEADERBOARD, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getClaimableAsset = (_payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_ASSET_RETURNED)
    })
  }

  _getClaimableBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.abi, asset.address)

    try {
      let balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      callback(null, bigInt(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getClaimable = async (web3, asset, account, callback) => {
    let claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)

    try {
      let balance = await claimContract.methods.claimable(account.address).call({ from: account.address });
      callback(null, bigInt(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  claim = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')
    const { amount } = payload.content

    this._approveIfNeeded(asset, account, amount, config.claimAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callClaim(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(CLAIM_RETURNED, res)
      })
    })
  }

  _callClaim = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)
    claimContract.methods.claim(amount.toString()).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_CLAIMABLE_ASSET, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getClaimable = (_payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_RETURNED)
    })
  }

  getGovRequirements = async (_payload) => {
    try {
      const account = store.getStore('account')
      const web3 = new Web3(store.getStore('web3context').library.provider);
      const governanceContract = new web3.eth.Contract(config.governanceABI,config.governanceAddress)

      // let balance = await governanceContract.methods.balanceOf(account.address).call({ from: account.address })
      // balance = bigInt(balance)

      const voteLock = await governanceContract.methods.voteLock(account.address).call({ from: account.address })
      const currentBlock = await web3.eth.getBlockNumber()

      const returnOBJ = {
        balanceValid: true,
        voteLockValid: voteLock > currentBlock,
        voteLock: voteLock
      }

      emitter.emit(GET_GOV_REQUIREMENTS_RETURNED, returnOBJ)
    } catch(ex) {
      return emitter.emit(ERROR, ex);
    }
  }

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)
      if(priceJSON) {
        return priceJSON.fast.toFixed(0)
      }
      return store.getStore('universalGasPrice')
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }
}

const store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
