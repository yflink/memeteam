import React, { PureComponent } from 'react'
import Store from '../stores'
import { GET_PROPOSALS_RETURNED } from '../web3/constants'
import { getFileFromLink, openTweet } from '../Utils'
import { getDisplayableAmountFromMinUnit } from '../web3/utils'
import Meme from '../components/Meme'
import BackButton from '../components/BackButton'
import Button from '@material-ui/core/Button'
import { Twitter } from '@material-ui/icons'

const emitter = Store.emitter
const store = Store.store

class Voted extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
  }

  componentWillUnmount() {
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
  }

  proposalsReturned = () => {
    this.setState({ redraw: true })
  }

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
    const memeId = this.getMemeId()
    const meme = store.getMemeForId(memeId)
    const asset = store.getYFLToken()
    if (!meme) {
      return null
    }

    return (
      <section className="guidance">
        <div className="guidance-container">
          <BackButton />
          <div className="guidance-wrapper">
            <div className="guidance-title">
              You Voted with {getDisplayableAmountFromMinUnit(asset.stakedBalance, asset.decimals, 6)} Staked $YFL
              <br />
              For Meme #{memeId}
            </div>
            <div className="guidance-copy">
              If this meme wins, 50% of the prize will be
              <br />
              shared pro-rata with voters for this meme
            </div>
            <Meme link={meme.link} memeClass="guidance-meme" />
            <div className="guidance-buttons">
              <Button className="button-main" onClick={this.handleTweet}>
                Tweet <Twitter />
              </Button>
              <Button className="button-white" onClick={this.handleGoToHome}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Voted
