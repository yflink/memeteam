import React, { PureComponent } from 'react'
import { TextField } from '@material-ui/core'
import * as _ from 'lodash'

import Store from '../../stores'
import {
  ERROR,
  PROPOSE,
  PROPOSE_CONFIRMED,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  GET_LEADERBOARD,
} from '../../web3/constants'
import Spinner from '../../components/Spinner'
import Meme from '../../components/Meme'
import BackButton from '../../components/BackButton'
import Button from '@material-ui/core/Button'
const store = Store.store
const emitter = Store.emitter
const dispatcher = Store.dispatcher

class Title extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned)
    emitter.on(PROPOSE_CONFIRMED, this.proposeConfirmed)
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned)
    emitter.removeListener(PROPOSE_CONFIRMED, this.proposeConfirmed)
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
  }

  proposeConfirmed = () => {
    // pull memes to get newly submitted meme
    // register GET_PROPOSALS_RETURNED here to pull after proposal is confirmed
    this.setState({ loading: false })
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
  }

  errorReturned = () => {
    this.setState({ loading: false })
  }

  handleTitleChange = (event) => {
    const { value } = event.target
    this.setState({ title: value })
  }

  handlePropose = () => {
    this.setState({ urlError: false })
    const { title } = this.state
    store.setStore({ creatingMemeTitle: title })
    this.setState({ loading: true })
    dispatcher.dispatch({ type: PROPOSE, content: { url: store.getCreatingMemeLink() } })
  }

  proposalsReturned = () => {
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    dispatcher.dispatch({ type: GET_LEADERBOARD, content: {} })

    const { history } = this.props

    const memes = store.getMemes()
    const account = store.getStore('account')
    const title = store.getStore('creatingMemeTitle')

    const newMemesCandidates = memes
      .filter((meme) => meme.proposer.toUpperCase() === account.address.toUpperCase())
      .filter((meme) => meme.title === title)
    if (newMemesCandidates.length === 0) {
      alert('Failed to fetch newly submitted meme')
      return
    }

    const newMeme = _.sortBy(newMemesCandidates, 'start')[0]
    history.replace(`/create/tweet/${newMeme.id}`)
  }

  render() {
    const { title, loading } = this.state
    const creatingMemeLink = store.getStore('creatingMemeLink')

    return (
      <section className="guidance">
        <div className="guidance-container">
          <BackButton />
          {loading ? (
            <div className="guidance-wrapper">
              <div className="guidance-body-spinner">
                <Spinner />
              </div>
              <div className="guidance-title">Confirm & Wait</div>
              <div className="guidance-copy">
                Confirm the transaction in your Meta Mask to upload your Meme! And wait until the transaction is
                confirmed.
              </div>
            </div>
          ) : (
            <div className="guidance-wrapper">
              <div className="guidance-title">Name your Artpiece</div>
              <Meme link={creatingMemeLink} memeClass="guidance-meme" />
              <div className="guidance-title-wrapper">
                <TextField
                  fullWidth
                  className="guidance-input"
                  value={title}
                  onChange={this.handleTitleChange}
                  variant="outlined"
                />
              </div>
              <div className="guidance-buttons">
                <Button className="button-main" onClick={this.handlePropose}>
                  Submit
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }
}

export default Title
