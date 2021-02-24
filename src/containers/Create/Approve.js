import React, { PureComponent } from 'react'
import { ERROR, APPROVE, APPROVE_RETURNED } from '../../web3/constants'
import Store from '../../stores'
import Button from '@material-ui/core/Button'
import BackButton from '../../components/BackButton'

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Approve extends PureComponent {
  state = {}

  getMemeId = () => {
    const { match } = this.props
    return match && match.params.id
  }

  async componentDidMount() {
    emitter.on(ERROR, this.errorReturned)
    emitter.on(APPROVE_RETURNED, this.showHash)

    const asset = store.getYFLToken()
    const payload = { type: APPROVE, content: { asset, amount: asset.balance } }

    this.setState({ loading: true })
    const approved = await store.checkApproval(payload)
    this.setState({ loading: false })

    if (approved) {
      this.handleOnApproved()
    }
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned)
    emitter.removeListener(APPROVE_RETURNED, this.showHash)
  }

  handleOnApproved = () => {
    const { history, isForCreate } = this.props
    history.replace(isForCreate ? `/create/stake` : `/details/${this.getMemeId()}/stake`)
  }

  showHash = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      that.setState({ snackbarMessage: txHash, snackbarType: 'Hash' })
      this.handleOnApproved()
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

  handleApprove = () => {
    this.setState({ loading: true })
    const asset = store.getYFLToken()
    dispatcher.dispatch({ type: APPROVE, content: { asset, amount: asset.balance } })
  }

  render() {
    return (
      <section className="guidance">
        <div className="guidance-container">
          <BackButton />
          <div className="guidance-wrapper">
            <div className="guidance-title">Approve $YFL</div>
            <div className="guidance-copy">We need your approval so we can put your $YFL into the Ballot Box</div>
            <div className="guidance-buttons">
              <Button className="button-main" onClick={this.handleApprove}>
                Approve $YFL
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Approve
