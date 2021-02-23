import React, { PureComponent } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Helmet } from 'react-helmet'
import qs from 'query-string'

import MemeDetail from '../components/MemeDetail'
import {
  ERROR,
  GET_PROPOSALS_RETURNED,
  VOTE_FOR,
  VOTE_FOR_CONFIRMED,
  NOW_TIMESTAMP_UPDATED,
  GET_LEADERBOARD,
  GET_LEADERBOARD_RETURNED,
} from '../web3/constants'
import Store from '../stores'
import { getVoterCount, getMyVoteCount } from '../web3/etherscan'

import Spinner from '../components/Spinner'
import { getFilteredMemes } from '../Utils/filters'

const emitter = Store.emitter
const store = Store.store
const dispatcher = Store.dispatcher

class Details extends PureComponent {
  state = {
    loading: false,
  }

  getMemeId = (props) => {
    const { match } = props || this.props
    return match && match.params.id
  }

  getMemesToShow = () => {
    const { now } = this.state
    const memes = store.getMemes()
    const selectedMemeComparator = (meme) => '' + meme.id === this.getMemeId()
    const selectedMeme = memes.find(selectedMemeComparator)
    if (!now) {
      return []
    }

    const openMemes = getFilteredMemes({
      memes,
      filters: {
        memeFilter: 'votes_open',
        sort: 'newest_to_oldest',
      },
      now,
    })

    if (openMemes.find(selectedMemeComparator)) {
      return openMemes
    } else {
      return [selectedMeme, ...openMemes]
    }
  }

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned)
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.on(VOTE_FOR_CONFIRMED, this.voteForConfirmed)
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow)
  }

  componentDidUpdate(prevProps, prevState) {
    const prevMemeId = this.getMemeId(prevProps)
    const { now } = this.state
    if (prevMemeId !== this.getMemeId() || (now && !prevState.now)) {
    }
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned)
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.removeListener(VOTE_FOR_CONFIRMED, this.voteForConfirmed)
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow)
  }

  errorReturned = (error) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  }

  proposalsReturned = () => {
    this.setState({ redraw: true })

    emitter.on(GET_LEADERBOARD_RETURNED, this.leaderboardReturned)
    dispatcher.dispatch({ type: GET_LEADERBOARD, content: {} })
  }

  leaderboardReturned = () => {
    emitter.removeListener(GET_LEADERBOARD_RETURNED, this.leaderboardReturned)
    this.setState({ redraw: true })
    this.setState({ leaderboard: store.getStore('leaderboard') })
  }

  voteForConfirmed = ({ proposal }) => {
    this.setState({ loading: false })

    const { history } = this.props
    history.push(`/details/${proposal.id}/voted`)
  }

  handleVote = (data) => {
    const { history } = this.props
    const meme = store.getMemeForId(data.id)
    if (store.stakedEnoughYFL()) {
      if (meme) {
        dispatcher.dispatch({ type: VOTE_FOR, content: { proposal: meme } })
        this.setState({ loading: true })
      }
    } else if (store.hasEnoughYFL()) {
      history.push(`/details/${data.id}/stake`)
    } else {
      history.push(`/details/${data.id}/buy`)
    }
  }

  changeToIndex = async (newIndex) => {
    const memes = this.state.leaderboard
    const leaderBordItem = memes[newIndex]
    const meme = store.getMemeForId(leaderBordItem.id)
    const memeId = leaderBordItem.id
    this.setState({ meme: meme, currentIndex: newIndex, leaderBordItem: leaderBordItem })
    window.history.replaceState(null, 'Meme Team', `/#/details/${memeId}`)
  }

  handleUpdateVoterCount = async (memeId) => {
    this.setState({ voterCount: null })
    const voterCount = await getVoterCount(memeId)
    this.setState({ voterCount })
  }

  handleUpdateMyVoteCount = async (memeId) => {
    const account = store.getStore('account')

    this.setState({ myVoteCount: null })
    const myVoteCount = await getMyVoteCount(memeId, account && account.address)
    this.setState({ myVoteCount })
  }

  updateNow = () => {
    let now = store.getStore('now')
    this.setState({ now })
  }

  renderHelmet = () => {
    let params = qs.parse(this.props.location.search)
    const { title, image } = params || {}
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="twitter:title" content={title} />
        {/** commenting as its not used anywhere
        <meta name="twitter:image" content={getImgurLinkFromFile(image)} />*/}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="og:type" content="website" />
      </Helmet>
    )
  }

  render() {
    const { leaderboard, meme, currentIndex, leaderBordItem } = this.state
    const maxIndex = leaderboard ? leaderboard.length - 1 : 0
    return (
      <>
        {this.renderHelmet()}

        {leaderboard ? (
          <>
            {meme && currentIndex ? (
              <MemeDetail
                {...meme}
                onVote={this.handleVote}
                leaderboardItem={leaderBordItem}
                maxIndex={maxIndex}
                currentIndex={currentIndex}
                changeToIndex={this.changeToIndex}
              />
            ) : (
              <>
                {this.getMemesToShow().map((newMeme, key) => {
                  if (!newMeme) {
                    return null
                  }
                  let newCurrentIndex = 0
                  let newLeaderboardItem = []
                  leaderboard.forEach((item, index) => {
                    if (item.id === newMeme.id) {
                      newCurrentIndex = index
                      newLeaderboardItem = item
                    }
                  })
                  return (
                    <MemeDetail
                      key={key}
                      {...newMeme}
                      onVote={this.handleVote}
                      leaderboardItem={newLeaderboardItem}
                      maxIndex={maxIndex}
                      currentIndex={newCurrentIndex}
                      changeToIndex={this.changeToIndex}
                    />
                  )
                })}
              </>
            )}
          </>
        ) : (
          <section className="meme-detail-body">
            <div className="meme-detail-container">
              <div className="meme-detail-spinner">
                <Spinner />
              </div>
            </div>
          </section>
        )}
      </>
    )
  }
}

export default Details
