import React, { PureComponent } from 'react'
import Button from '@material-ui/core/Button'
import { getFileFromLink, openTweet } from '../../Utils'
import { abbreviateAddress, titleCheck } from '../../web3/utils'
import { NOW_TIMESTAMP_UPDATED } from '../../web3/constants'
import Store from '../../stores'
import Meme from '../Meme'
import './styles.css'
import CardAdvancedRatingBar from '../CardAdvancedRatingBar'
import { Twitter, Heart, ChevronLeft, ChevronRight } from 'react-feather'

const emitter = Store.emitter
const store = Store.store

class MemeDetail extends PureComponent {
  state = {
    leaderboard: this.props.leaderboard,
  }

  async componentDidMount() {
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow)
  }

  componentWillUnmount() {
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow)
  }

  updateNow = () => {
    let now = store.getStore('now')
    this.setState({ now })
  }

  handleTweet = () => {
    const { id, title, link } = this.props
    openTweet(id, title, getFileFromLink(link))
  }

  handleNav = (direction) => {
    const { currentIndex, maxIndex, changeToIndex } = this.props
    if (direction === 'next') {
      if (currentIndex === maxIndex) {
        changeToIndex(0)
      } else {
        changeToIndex(currentIndex + 1)
      }
    } else {
      if (currentIndex === 0) {
        changeToIndex(maxIndex)
      } else if (currentIndex === 1) {
        changeToIndex(0)
      } else {
        changeToIndex(currentIndex - 1)
      }
    }
  }

  render() {
    const { id, link, title, end, displayName, proposer, onVote, leaderboardItem } = this.props
    const { now } = this.state
    const countdown = end - now

    return (
      <section className="meme-detail-body">
        <div className="meme-detail-container">
          <div className="meme-detail-header">
            <div className="meme-detail-meta">
              <div className="meme-detail-id">#{id}</div>
              <a href="/" className="meme-detail-link">
                Operation Dry Run
              </a>
            </div>
            <h2 className="meme-detail-name">{titleCheck(title)}</h2>
          </div>
          <div className="meme-detail-controls">
            <Meme link={link} memeClass="meme-detail-image" alt={titleCheck(title)} />
            <Button className="button-control left" onClick={() => this.handleNav('previous')}>
              <ChevronLeft />
            </Button>
            <Button className="button-control right" onClick={() => this.handleNav('next')}>
              <ChevronRight />
            </Button>
          </div>
          <div className="meme-detail-footer">
            <div className="meme-detail-proposer">
              <div className="meme-detail-display-name">{displayName ? displayName : `Unknown Artist`}</div>
              <a href={`https://etherscan.io/address/${proposer}`} target="_blank">
                {abbreviateAddress(proposer).toUpperCase()}
              </a>
            </div>
            <CardAdvancedRatingBar score={leaderboardItem?.votesFor} shares={10} />
          </div>
          <div className="meme-detail-action">
            <Button className="button-white fixed" onClick={this.handleTweet}>
              Tweet <Twitter />
            </Button>
            {countdown > 0 ? (
              <Button className="button-main expand" onClick={() => onVote({ id })}>
                Vote <Heart />
              </Button>
            ) : (
              <Button className="button-main expand" disabled={true}>
                Voting closed
              </Button>
            )}
          </div>
        </div>
      </section>
    )
  }
}

export default MemeDetail
