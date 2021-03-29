import React, { PureComponent } from 'react'

import Store from '../../stores'
import { getFileFromLink, openTweet } from '../../Utils'
import Button from '@material-ui/core/Button'
import { Twitter } from '@material-ui/icons'

const pepeBrainImg = require('../../assets/images/200824_pepeBrain.png')

const store = Store.store

class Tweet extends PureComponent {
  state = {}

  getMemeId = () => {
    const { match } = this.props
    return match && match.params.id
  }

  handleTweet = () => {
    const title = store.getStore('creatingMemeTitle')
    const creatingMemeLink = store.getStore('creatingMemeLink')
    openTweet(this.getMemeId(), title, getFileFromLink(creatingMemeLink))
  }

  handleGoToHome = () => {
    const { history } = this.props
    history.replace('/')
  }

  render() {
    return (
      <section className="guidance">
        <div className="guidance-container">
          <div className="guidance-wrapper">
            <img className="guidance-image" src={pepeBrainImg} alt="Meme submitted!" />
            <div className="guidance-title">Meme burned into the blockchain!</div>
            <div className="guidance-copy">
              You’ve put your Meme on the holy wall for everyone to see. Now get the buzz going and share your art on
              Twitter!
            </div>
            <div className="guidance-buttons">
              <Button className="button-main" onClick={this.handleTweet}>
                Tweet <Twitter />
              </Button>
              <Button className="button-white" onClick={this.handleGoToHome}>
                Skip
              </Button>
            </div>
            <div className="guidance-pagination">
              <span className="guidance-step is-done" />
              <span className="guidance-step is-done" />
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Tweet
