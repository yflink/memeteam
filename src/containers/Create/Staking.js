import React, { PureComponent } from 'react'
import bigInt from 'big-integer'
import { TextField, Typography, Snackbar } from '@material-ui/core'
import Spinner from '../../components/Spinner'

import Store from '../../stores'
import { ERROR, STAKE, STAKE_CONFIRMED, GET_BALANCES_RETURNED } from '../../web3/constants'
import { toFixed } from '../../web3/utils'
import './styles.css'
import BackButton from '../../components/BackButton'
import Button from '@material-ui/core/Button'

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Staking extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned)
    emitter.on(STAKE_CONFIRMED, this.proposeConfirmed)
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned)
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned)
    emitter.removeListener(STAKE_CONFIRMED, this.proposeConfirmed)
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned)
  }

  balancesReturned = () => {
    this.setState({ redraw: true })
  }

  proposeConfirmed = () => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      that.setState({ snackbarType: 'Hash' })
      that.handleGoToAllSet()
    })
  }

  errorReturned = (error) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  }

  getMemeId = () => {
    const { match } = this.props
    return match && match.params.id
  }

  handleGoToAllSet = () => {
    const { history, isForCreate, isForDetail } = this.props
    history.replace(
      isForCreate ? `/create/allset` : isForDetail ? `/details/${this.getMemeId()}/allset` : `/stake/allset`
    )
  }

  handleStake = () => {
    this.setState({ amountError: false })
    const asset = store.getYFLToken()
    const amountString = this.state[asset.id + '_stake']

    if (!amountString) {
      alert('Invalid amount!')
      return
    }

    const amount = bigInt((parseFloat(amountString) * 10 ** asset.decimals).toString())
    const token = store.getYFLToken()

    if (bigInt(amount + token.stakedBalance) < store.getMinYFLToStakeToMinUnit()) {
      alert('Insufficient amount!')
      return
    }

    if (amount > token.balance) {
      alert('You have insufficient YFLs to stake this amount!')
      return
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: STAKE, content: { asset: asset, amount: amount } })
  }

  handleChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value.replace(/[^0-9.]/g, '')

    this.setState(val)
  }

  setAmount = (id, type, balance) => {
    const bal = toFixed(balance, 18, 6)
    let val = []
    val[id + '_' + type] = bal
    this.setState(val)
  }

  renderStake = () => {
    const { snackbarMessage, loading } = this.state
    const asset = store.getYFLToken()
    const type = 'stake'
    const amount = this.state[asset.id + '_' + type]
    const amountError = this.state[asset.id + '_' + type + '_error']

    return (
      <div className="guidance-staking">
        <p className="guidance-balance">
          {'Balance: ' + (asset && asset.balance ? toFixed(asset.balance, asset.decimals, 6) : '0') + ' $YFL'}
        </p>
        <div className="guidance-row">
          <div className="guidance-input-wrapper">
            <TextField
              fullWidth
              className="guidance-input"
              disabled={loading}
              id={'' + asset.id + '_' + type}
              value={amount}
              error={amountError}
              onChange={this.handleChange}
              placeholder="Min 0.12"
              variant="outlined"
              type="text"
            />
            <Button
              className="button-max"
              onClick={() => {
                this.setAmount(asset.id, type, asset ? asset.balance : bigInt())
              }}
            >
              Max
            </Button>
          </div>
          <Button className="button-main" onClick={this.handleStake}>
            Stake
          </Button>
        </div>
        {snackbarMessage && this.renderSnackbar()}
      </div>
    )
  }

  renderSnackbar = () => {
    var { snackbarType, snackbarMessage } = this.state
    return <Snackbar type={snackbarType} message={snackbarMessage} open autoHideDuration={6000} />
  }

  render() {
    const { loading } = this.state
    return (
      <section className="guidance">
        <div className="guidance-container">
          <BackButton />
          {loading ? (
            <div className="guidance-wrapper">
              <div className="guidance-body-spinner">
                <Spinner />
              </div>
              <div className="guidance-title">Approve & Stake</div>
              <div className="guidance-copy">
                Your MetaMask should require you to approve your YFL now. Please follow the instructions on the screen
                to get started as quickly as possible.
                <br />
                If you already approved your YFL, MetaMask should require you to send your transaction.
              </div>
            </div>
          ) : (
            <div className="guidance-wrapper">
              <div className="guidance-title">How Many $YFL do you want to stake?</div>
              <div className="guidance-copy">
                You can take them out of the contract at any time. Except when you vote for or submit a meme, you have
                to wait 3 days before taking out your precious $YFL.
              </div>
              {this.renderStake()}
            </div>
          )}
        </div>
      </section>
    )
  }
}

export default Staking
