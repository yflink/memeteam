import React, { PureComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import CardRatingBar from '../CardRatingBar'
import CardTimeBar from '../CardTimeBar'
import { getRoundedWei } from '../../web3/utils'
import ReactPlayer from 'react-player'
import { NOW_TIMESTAMP_UPDATED } from '../../web3/constants'
import Store from '../../stores'

import './styles.css'

export const logo = require('../../assets/images/YFLink_blue_round.svg')

const emitter = Store.emitter
const store = Store.store

class ImageCard extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow)
  }

  componentWillUnmount() {
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow)
  }

  updateNow = () => {
    let now = store.getStore('now')
    this.setState({ now })
  }

  render() {
    const { id, link, title, totalForVotes, end, isForBrowseMore, leaderboardItem, proposer } = this.props
    const { now } = this.state
    const isVideo = ReactPlayer.canPlay(link)

    if (isForBrowseMore) {
      return (
        <Grid container className={classnames('card')} id={id}>
          <div>
            <Link to="/" replace>
              <img className="img card-logo" src={logo} alt="meme" />
            </Link>
          </div>
          <p className="card-title card-logo-title">Browse More Memes</p>
        </Grid>
      )
    }

    return (
      <div className="card">
        <CardTimeBar elapsed={end - now} />
        <div class="card-id">
          <span>#{id}</span>
        </div>
        <h3 className="card-title">{title ? title : 'untitled'}</h3>
        {isVideo ? (
          <div class="card-video">
            <ReactPlayer url={link} width="100%" controls={true} />
          </div>
        ) : (
          <Link to={`/details/${id}`} replace className="card-link">
            <img className="img card-image" src={link} alt="meme" />
          </Link>
        )}
        <CardRatingBar proposer={proposer} rating={leaderboardItem?.score?.toFixed(2) || '--'} />
      </div>
    )
  }
}

export default ImageCard
