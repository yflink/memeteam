import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core/styles'

import { ERROR, VOTE_FOR_CONFIRMED, VOTE_FOR } from '../../web3/constants'
import Store from '../../stores'
import Spinner from '../../components/Spinner'
import BackButton from '../../components/BackButton'
import Button from '@material-ui/core/Button'
import { getDisplayableAmountFromMinUnit } from '../../web3/utils'

const emitter = Store.emitter
const store = Store.store
const dispatcher = Store.dispatcher

const pepeAmazeImg = require('../../assets/images/200824_pepeAmaze.png')

class AllSet extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned)
    emitter.on(VOTE_FOR_CONFIRMED, this.voteForConfirmed)
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned)
    emitter.removeListener(VOTE_FOR_CONFIRMED, this.voteForConfirmed)
  }

  getMemeId = () => {
    const { match } = this.props
    return match && match.params.id
  }

  handleContinue = () => {
    const { history, isForCreate, isForDetail } = this.props
    const meme = store.getMemeForId(this.getMemeId())
    if (isForCreate) {
      history.replace('/create?isFromStake=true')
    } else if (isForDetail) {
      dispatcher.dispatch({ type: VOTE_FOR, content: { proposal: meme } })
      this.setState({ loading: true })
    } else {
      history.replace('/')
    }
  }

  voteForConfirmed = () => {
    emitter.removeListener(VOTE_FOR_CONFIRMED, this.voteForConfirmed)

    this.setState({ loading: false })

    const { history } = this.props
    history.replace(`/details/${this.getMemeId()}/voted`)
  }

  errorReturned = (error) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  }

  render() {
    const { loading } = this.state
    const token = store.getYFLToken()
    const stakedBalance = getDisplayableAmountFromMinUnit(token.stakedBalance, token.decimals, 2)

    return (
      <section className="guidance">
        <div className="guidance-container">
          <BackButton />
          {loading ? (
            <div className="guidance-body-spinner">
              <Spinner />
            </div>
          ) : (
            <div className="guidance-wrapper">
              <img className="guidance-image" src={pepeAmazeImg} alt="All set!" />
              <div className="guidance-title">You’re all Set!</div>
              <div className="guidance-copy">
                With your {stakedBalance} $YFL staked you are now able to vote for your favourite memes or submit your
                memes to various campaigns yourself
              </div>
              <div className="guidance-buttons">
                <Button className="button-main" onClick={this.handleContinue}>
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }
}

export default AllSet
