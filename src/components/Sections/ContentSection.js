import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'

import ImageCard from '../ImageCard'
import './styles.css'
import Store from '../../stores'
import {
  ERROR,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  CONFIGURE,
  CONNECTION_CONNECTED,
  GET_BALANCES,
  GET_LEADERBOARD,
  GET_LEADERBOARD_RETURNED,
} from '../../web3/constants'

import { getFilteredMemes } from '../../Utils/filters'
import { NOW_TIMESTAMP_UPDATED } from '../../web3/constants'
import { getMyVotedProposalIds } from '../../web3/etherscan'

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class ContentSection extends PureComponent {
  state = {
    loading: false,
    width: window.outerWidth,
  }

  constructor(props) {
    super(props)

    const account = store.getStore('account')

    if (account && account.address) {
      dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
    }
  }

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned)
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected)
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow)
    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned)
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected)
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow)
    window.removeEventListener('resize', this.updateDimensions)
  }

  leaderboardReturned = () => {
    emitter.removeListener(GET_LEADERBOARD_RETURNED, this.leaderboardReturned)
    this.setState({ redraw: true })
  }

  async componentDidUpdate(prevProps) {
    const account = store.getStore('account')
    const { filters } = this.props

    if (prevProps.filters && filters) {
      if (prevProps.filters.memeFilter !== 'my_votes' && filters.memeFilter === 'my_votes') {
        const myVotedProposalIds = await getMyVotedProposalIds(account && account.address)
        this.setState({ myVotedProposalIds })
      }
    }
  }

  updateNow = () => {
    let now = store.getStore('now')
    this.setState({ now })
  }

  errorReturned = (error) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  }

  connectionConnected() {
    const account = store.getStore('account')
    if (account && account.address) {
      dispatcher.dispatch({ type: GET_BALANCES, content: {} })
      dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
      dispatcher.dispatch({ type: CONFIGURE })
    }
  }

  proposalsReturned = () => {
    const memes = store.getMemes()
    this.setState({ memes })
    dispatcher.dispatch({ type: GET_LEADERBOARD, content: {} })
    emitter.on(GET_LEADERBOARD_RETURNED, this.leaderboardReturned)
  }

  updateDimensions = () => {
    this.setState({ width: window.outerWidth })
  }

  render() {
    const { isFromDetail, filters, updateMemes } = this.props
    const { memes = [], now, myVotedProposalIds } = this.state
    const leaderboard = store.getStore('leaderboard') || []

    const account = store.getStore('account')
    const filteredMemes = filters
      ? getFilteredMemes({
          memes,
          filters,
          now,
          myAddress: account && account.address,
          myVotedProposalIds,
          leaderboard,
        })
      : memes

    let contentHeight

    if (this.state.width > 1424) {
      contentHeight = filteredMemes.length * 210 + 40
    } else if (this.state.width <= 1424 && this.state.width > 915) {
      contentHeight = filteredMemes.length * 400 + 40
    } else {
      contentHeight = 'auto'
    }

    if (updateMemes) {
      updateMemes(filteredMemes)
    }

    return (
      <div style={{ width: '100%', marginTop: 18 }}>
        <div className="card-container" style={{ height: contentHeight }}>
          {(isFromDetail ? [...filteredMemes, { isForBrowseMore: true }] : filteredMemes).map((meme) => {
            const leaderboardItem = leaderboard.find((item) => item.id === meme.id)
            if (leaderboardItem) {
              return <ImageCard {...meme} leaderboardItem={leaderboardItem} key={meme.id} />
            } else {
              return null
            }
          })}
        </div>
      </div>
    )
  }
}

export default ContentSection
