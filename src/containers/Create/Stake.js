import React, { PureComponent } from 'react'
import Store from '../../stores'
import { GET_BALANCES_RETURNED } from '../../web3/constants'
import './styles.css'
import BackButton from '../../components/BackButton'
import Button from '@material-ui/core/Button'
import { getDisplayableAmountFromMinUnit } from '../../web3/utils'

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
    const stakedBalance = getDisplayableAmountFromMinUnit(token.stakedBalance, token.decimals, 2)
    return (
      <section className="guidance">
        <div className="guidance-container">
          <BackButton />
          <div className="guidance-wrapper">
            <div className="guidance-title">Stake YFL</div>
            <div className="guidance-copy">
              To participate in this, you have to have at least 0.12 $YFL staked in the smart contract.
            </div>
            <div className="guidance-buttons">
              <Button className="button-main" href="/#/create/staking">
                Stake YFL
              </Button>
              {Number(stakedBalance) >= 0.12 && (
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
