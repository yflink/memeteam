import * as _ from 'lodash';
import { campaignConfig } from '../campaign.config';
import { getRoundedWei } from '../web3/utils';

const diffFromToday = (start, now) => {
  return (now - start) * 13.8 * 1000
};

export const SORTS = [
  {
    id: 'newest_to_oldest',
    label: 'Newest to Oldest',
  },
  {
    id: 'oldest_to_newest',
    label: 'Oldest to Newest',
  },
  {
    id: 'highest_to_lowest_score',
    label: 'Highest Score to Lowest Score',
  },
  {
    id: 'lowest_to_highest_score',
    label: 'Lowest Score to Highest Score',
  },
];

export const TIME_FILTERS = [
  {
    id: 'all_time',
    label: 'All Time',
  },
  {
    id: 'today',
    label: 'Today',
  },
  {
    id: 'last_7_days',
    label: 'Last 7 days',
  },
];

export const MEME_FILTERS = [
  {
    id: 'votes_open',
    label: 'Votes Open',
  },
  {
    id: 'votes_closed',
    label: 'Votes Closed',
  },
  {
    id: 'my_memes',
    label: 'My Memes',
  },
  {
    id: 'my_votes',
    label: 'My Votes',
  },
  {
    id: 'all_memes',
    label: 'All Memes',
  },
];

export const CAMPAIGN_FILTERS = [
  {
    id: 'all_campaigns',
    label: 'All Campaigns',
  },
  ...(campaignConfig.includedCampaignDropdowns.map(campaign => ({
    id: campaign,
    label: campaign,
  })))
]

const refillWithLeaderboard = (memes, leaderboard) => {
  return memes.map(meme => {
    const leaderboardItem = leaderboard.find(item => item.id === meme.id);
    return {
      ...meme,
      score: leaderboardItem.score,
    };
  });
}

export const getFilteredMemes = ({ memes, filters, now, myAddress, myVotedProposalIds, leaderboard }) => {
  const { sort, timeFilter, memeFilter, campaignFilter } = filters;
  let filteredMemes = memes;

  switch (sort) {
    case 'newest_to_oldest':
      filteredMemes = _.orderBy(memes, 'start', 'desc');
      break;
    case 'oldest_to_newest':
      filteredMemes = _.orderBy(memes, 'start', 'asc');
      break;
    case 'highest_to_lowest_score':
      if (leaderboard?.length) {
        filteredMemes = _.orderBy(refillWithLeaderboard(memes, leaderboard), meme => meme.score, 'desc');
      } else {
        filteredMemes = _.orderBy(memes, meme => getRoundedWei(meme.totalForVotes), 'desc');
      }
      break;
    case 'lowest_to_highest_score':
      if (leaderboard?.length) {
        filteredMemes = _.orderBy(refillWithLeaderboard(memes, leaderboard), meme => meme.score, 'asc');
      } else {
        filteredMemes = _.orderBy(memes, meme => getRoundedWei(meme.totalForVotes), 'asc');
      }
      break;
  }

  switch (timeFilter) {
    case 'today':
      filteredMemes = filteredMemes.filter(meme => diffFromToday(meme.start, now) < 1 * 24 * 60 * 60 * 1000);
      break;
    case 'last_7_days':
      filteredMemes = filteredMemes.filter(meme => diffFromToday(meme.start, now) < 7 * 24 * 60 * 60 * 1000);
      break;
  }

  switch (memeFilter) {
    case 'votes_open':
      filteredMemes = filteredMemes.filter(meme => now < parseInt(meme.end));
      break;
    case 'votes_closed':
      filteredMemes = filteredMemes.filter(meme => now > parseInt(meme.end));
      break;
    case 'my_memes':
      filteredMemes = filteredMemes.filter(meme => meme.proposer.toUpperCase() === myAddress.toUpperCase());
      break;
    case 'my_votes':
      filteredMemes = filteredMemes.filter(meme => myVotedProposalIds && myVotedProposalIds.includes('' + meme.id));
      break;
  }

  if (campaignFilter && campaignFilter !== 'all_campaigns') {
    filteredMemes = filteredMemes.filter(meme => meme.campaign === campaignFilter);
  }

  return filteredMemes;
}
