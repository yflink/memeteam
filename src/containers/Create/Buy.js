import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'

import Store from '../../stores'
import { GET_BALANCES, GET_BALANCES_RETURNED } from '../../web3/constants'
import Button from '@material-ui/core/Button'
import BackButton from '../../components/BackButton'
import { getDisplayableAmountFromMinUnit } from '../../web3/utils'

const yflToken = require('../../assets/images/yfl-token.png')

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Buy extends PureComponent {
  state = {}

  constructor(props) {
    super(props)

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
  }

  componentDidMount() {
    this.balanceCheckTimer = setInterval(() => {
      dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    }, 3000)

    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned)
  }

  componentWillUnmount() {
    clearInterval(this.balanceCheckTimer)

    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned)
  }

  balancesReturned = () => {
    this.setState({ redraw: true })
  }

  handleGoToBuy = () => {
    window.open('https://linkswap.app/#/swap?outputCurrency=0x28cb7e841ee97947a86b06fa4090c8451f64c0be', '_blank')
  }

  getMemeId = () => {
    const { match } = this.props
    return match && match.params.id
  }

  render() {
    const token = store.getYFLToken()
    const { isForCreate } = this.props
    const stakedBalance = getDisplayableAmountFromMinUnit(token.stakedBalance, token.decimals, 2)

    if (store.hasEnoughYFL()) {
      return <Redirect to={isForCreate ? '/create/welcome' : `/details/${this.getMemeId()}/welcome`} />
    }
    return (
      <section className="guidance">
        <div className="guidance-container">
          <BackButton />
          <div className="guidance-wrapper">
            <img className="guidance-image" src={yflToken} alt="Buy YFL!" />
            <div className="guidance-title">Buy $YFL</div>
            <div className="guidance-copy">
              To participate in this, you have to have at least {store.MIN_YFL_TO_STAKE} $YFL staked in the smart
              contract.
            </div>
            <div className="guidance-buttons">
              <Button
                className="button-main"
                target="_blank"
                href="https://linkswap.app/#/swap?outputCurrency=0x28cb7e841ee97947a86b06fa4090c8451f64c0be"
              >
                Buy $YFL
              </Button>
              {Number(stakedBalance) >= store.MIN_YFL_TO_STAKE && (
                <Button className="button-white" href="/#/create/allset">
                  Already staked
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Buy
