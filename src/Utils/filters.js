import * as _ from 'lodash';
import { campaignConfig } from '../campaign.config';

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
    id: 'most_to_least_votes',
    label: 'Most Votes to Least Votes',
  },
  {
    id: 'least_to_most_votes',
    label: 'Least Votes to Most Votes',
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

export const getFilteredMemes = ({ memes, filters, now, myAddress, myVotedProposalIds }) => {
  const { sort, timeFilter, memeFilter, campaignFilter } = filters;
  let filteredMemes = memes;
  switch (sort) {
    case 'newest_to_oldest':
      filteredMemes = _.orderBy(memes, 'start', 'desc');
      break;
    case 'oldest_to_newest':
      filteredMemes = _.orderBy(memes, 'start', 'asc');
      break;
    case 'most_to_least_votes':
      filteredMemes = _.orderBy(memes, 'totalForVotes', 'desc');
      break;
    case 'least_to_most_votes':
      filteredMemes = _.orderBy(memes, 'totalForVotes', 'asc');
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
