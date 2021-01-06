import axios from 'axios';
import AbiDecoder from 'abi-decoder';
import * as _ from 'lodash';
import Web3 from 'web3';

import config from '../config';
import Store from "../stores";

let store
setTimeout(() => {
    store = Store.store;
}, 0)

const ETHERSCAN_API_TOKEN = 'UMPBWAXRAGZZWA4SMAJN8NV218XYMX6IV5';

AbiDecoder.addABI(config.governanceABI);

const getAllTransactionsForVoteFor = async () => {
    try {
        const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${config.governanceAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_TOKEN}`;
        const response = await axios.get(apiUrl);
        const transactionsForVoteFor = response.data.result.map(tx => ({
            ...tx,
            input: AbiDecoder.decodeMethod(tx.input),
        }))
        return transactionsForVoteFor.filter(tx => tx.input && tx.input.name === 'voteFor');
    } catch (err) {
        return [];
    }
};

export const getMyVotedProposalIds = async (accountAddress) => {
    if (!accountAddress) {
        return [];
    }

    try {
        const transactionsForVoteFor = await getAllTransactionsForVoteFor()
        const myTransactionsForVoteFor = transactionsForVoteFor.filter(tx => tx.from.toUpperCase() === accountAddress.toUpperCase());
        const proposalIds = myTransactionsForVoteFor.map(tx => _.get(tx, 'input.params[0].value'));
        return proposalIds;
    } catch (err) {
        return [];
    }
};

export const getVoterCount = async (proposalId) => {
    try {
        const transactionsForVoteFor = await getAllTransactionsForVoteFor();
        const voterIds = transactionsForVoteFor
            .filter(tx => _.get(tx, 'input.params[0].value') === '' + proposalId)
            .map(tx => tx.from);
        const uniqIds = [...(new Set(voterIds))];
        return uniqIds.length;
    } catch (err) {
        console.error(err);
        return [];
    }
};

const getStakedBalanceFromBlockNo = async (blockNo, accountAddress, tokenAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.governanceABI, tokenAddress)
    try {
        let balance = await erc20Contract.methods.balanceOf(accountAddress).call({ from: accountAddress }, blockNo);
        return balance;
    } catch(err) {
        console.error(err);
        return null;
    }
}

export const getMyVoteCount = async (proposalId, accountAddress) => {
    if (!accountAddress) {
        return [];
    }

    try {
        const transactionsForVoteFor = await getAllTransactionsForVoteFor();
        const blockNumbers = transactionsForVoteFor
            .filter(tx => _.get(tx, 'input.params[0].value') === '' + proposalId)
            .filter(tx => tx.from.toUpperCase() === accountAddress.toUpperCase())
            .map(tx => parseInt(tx.blockNumber));
        const lowestBlockNo = Math.min(blockNumbers);
        const stakedBalance = await getStakedBalanceFromBlockNo(lowestBlockNo, accountAddress, config.governanceAddress);
        return stakedBalance;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getPosterLinkBalance = async (meme) => {
    if (!meme) {
        return null;
    }

    const { proposer, start } = meme;
    try {
        const balance = await getStakedBalanceFromBlockNo(start, proposer, config.pool0StakeAddress);
        return balance;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const getPosterYFLBalance = async (meme) => {
    if (!meme) {
        return null;
    }

    const { proposer, start } = meme;
    try {
        const balance = await getStakedBalanceFromBlockNo(start, proposer, config.yflAddress);
        return balance;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const getPosterYFLStakedBalance = async (meme) => {
    if (!meme) {
        return null;
    }

    const { proposer, start } = meme;
    try {
        const balance = await getStakedBalanceFromBlockNo(start, proposer, config.governanceAddress);
        return balance;
    } catch (err) {
        console.error(err);
        return null;
    }
};
