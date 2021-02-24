import React, { PureComponent } from 'react'
import Store from '../../stores'
import { GET_BALANCES_RETURNED } from '../../web3/constants'
import './styles.css'
import BackButton from '../../components/BackButton'
import Button from '@material-ui/core/Button'
import { getDisplayableAmountFromMinUnit } from '../../web3/utils'

const yflToken = require('../../assets/images/yfl-token.png')
const store = Store.store
const emitter = Store.emitter

class Stake extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned)
  }

  componentWillUnmount() {
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned)
  }

  balancesReturned = () => {
    this.setState({ redraw: true })
  }

  render() {
    const token = store.getYFLToken()
    const balance = getDisplayableAmountFromMinUnit(token.balance, token.decimals, 2)
    const stakedBalance = getDisplayableAmountFromMinUnit(token.stakedBalance, token.decimals, 2)

    return (
      <section className="guidance">
        <div className="guidance-container">
          <BackButton />
          <div className="guidance-wrapper">
            <img className="guidance-image" src={yflToken} alt="Stake YFL!" />
            <div className="guidance-title">Stake YFL</div>
            <div className="guidance-copy">
              To participate in this, you have to have at least {store.MIN_YFL_TO_STAKE} $YFL staked in the smart
              contract.
            </div>
            <div className="guidance-buttons">
              {Number(balance) < store.MIN_YFL_TO_STAKE ? (
                <Button
                  className="button-main"
                  target="_blank"
                  href="https://linkswap.app/#/swap?outputCurrency=0x28cb7e841ee97947a86b06fa4090c8451f64c0be"
                >
                  Buy $YFL
                </Button>
              ) : (
                <Button className="button-main" href="/#/create/staking">
                  Stake $YFL
                </Button>
              )}
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

export default Stake
