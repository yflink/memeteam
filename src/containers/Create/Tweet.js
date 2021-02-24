import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core/styles'

import Store from '../../stores'
import { getFileFromLink, openTweet } from '../../Utils'
import { campaignConfig } from '../../campaign.config'
import Meme from '../../components/Meme'

const pepeBrainImg = require('../../assets/images/200824_pepeBrain.png')

const store = Store.store

const styles = () => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 16px 16px 64px',
  },
  imgurImg: {
    width: '280px',
    objectFit: 'contain',
    objectPosition: 'top',
  },
  pepeBrainImg: {
    width: '200px',
    height: '200px',
  },
  bigTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tweetContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
})

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
    const { classes } = this.props
    const creatingMemeLink = store.getStore('creatingMemeLink')

    return (
      <div className={classes.root}>
        <Meme link={creatingMemeLink} memeClass={classes.imgurImg} />
        <div className={classes.container}>
          <div className={classes.bigTitle}>
            Meme Submitted
            <br />
            To Operation {campaignConfig.currentCampaign}!
          </div>
          <img className={classes.pepeBrainImg} src={pepeBrainImg} alt="Brain" />
          <div className={classes.bigTitle}>
            Big Brain Time – Click Tweet
            <br />
            To Farm Some Votes from Twitter
          </div>
          <div className={classes.tweetContainer}>
            <button className="skip-button" onClick={this.handleGoToHome}>
              <div className="skip-button-text">Skip</div>
            </button>
            <button className="round-button" onClick={this.handleTweet}>
              <div className="round-button-text">Tweet</div>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Tweet)
