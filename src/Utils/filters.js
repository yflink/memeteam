import * as _ from 'lodash'
import { getRoundedWei } from '../web3/utils'

export const SORTS = [
  {
    id: 'most_recent',
    label: 'Most recent',
  },
  {
    id: 'most_popular',
    label: 'Most popular',
  },
]

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
]
const refillWithLeaderboard = (memes, leaderboard) => {
  return memes.map((meme) => {
    const leaderboardItem = leaderboard.find((item) => item.id === meme.id)
    return {
      ...meme,
      score: leaderboardItem.score,
    }
  })
}

export const getFilteredMemes = ({ memes, filters, now, myAddress, myVotedProposalIds, leaderboard }) => {
  const { sort, memeFilter } = filters
  let filteredMemes = memes

  switch (sort) {
    case 'most_recent':
      filteredMemes = _.orderBy(memes, 'start', 'desc')
      break
    case 'oldest_to_newest':
      filteredMemes = _.orderBy(memes, 'start', 'asc')
      break
    case 'most_popular':
      if (leaderboard?.length) {
        filteredMemes = _.orderBy(refillWithLeaderboard(memes, leaderboard), (meme) => meme.score, 'desc')
      } else {
        filteredMemes = _.orderBy(memes, (meme) => getRoundedWei(meme.totalForVotes), 'desc')
      }
      break
  }

  switch (memeFilter) {
    case 'votes_open':
      filteredMemes = filteredMemes.filter((meme) => now < parseInt(meme.end))
      break
    case 'votes_closed':
      filteredMemes = filteredMemes.filter((meme) => now > parseInt(meme.end))
      break
    case 'my_memes':
      filteredMemes = filteredMemes.filter((meme) => meme.proposer.toUpperCase() === myAddress.toUpperCase())
      break
    case 'my_votes':
      filteredMemes = filteredMemes.filter((meme) => myVotedProposalIds && myVotedProposalIds.includes('' + meme.id))
      break
  }

  return filteredMemes
}
