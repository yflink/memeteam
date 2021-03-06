import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import CardRatingBar from '../CardRatingBar'
import CardTimeBar from '../CardTimeBar'
import ReactPlayer from 'react-player'
import { NOW_TIMESTAMP_UPDATED } from '../../web3/constants'
import Store from '../../stores'

import './styles.css'

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

  scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  render() {
    const { id, link, title, end, leaderboardItem, proposer } = this.props
    const { now } = this.state
    const isVideo = ReactPlayer.canPlay(link)

    return (
      <div className="card">
        <CardTimeBar elapsed={end - now} />
        <Link
          to={`/details/${id}`}
          replace
          className="card-id-link"
          onClick={() => {
            this.scrollTop()
          }}
        >
          <div className="card-id">
            <span>#{id}</span>
          </div>
        </Link>
        <Link
          to={`/details/${id}`}
          replace
          className="card-title-link"
          onClick={() => {
            this.scrollTop()
          }}
        >
          <h3 className="card-title">{title ? title : 'untitled'}</h3>
        </Link>
        {isVideo ? (
          <div className="card-video">
            <ReactPlayer url={link} width="100%" controls={true} />
          </div>
        ) : (
          <Link
            to={`/details/${id}`}
            replace
            className="card-link"
            onClick={() => {
              this.scrollTop()
            }}
          >
            <img className="img card-image" src={link} alt="meme" />
          </Link>
        )}
        <CardRatingBar proposer={proposer} rating={parseFloat(leaderboardItem?.votesFor).toFixed(0) || '--'} />
      </div>
    )
  }
}

export default ImageCard
