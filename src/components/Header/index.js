import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

import { GET_BALANCES_RETURNED, NOW_TIMESTAMP_UPDATED } from '../../web3/constants'
import Store from '../../stores'
import { abbreviateAddress, getDisplayableAmountFromMinUnit } from '../../web3/utils'
import { campaignConfig } from '../../campaign.config'

import './styles.css'

const store = Store.store
const emitter = Store.emitter

class Header extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned)
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow)
  }

  componentWillUnmount() {
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned)
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow)
  }

  balancesReturned = () => {
    this.setState({ redraw: true })
  }

  updateNow = () => {
    let now = store.getStore('now')
    this.setState({ now })
  }

  handleGoToStake = () => {
    const { history } = this.props
    history.replace('/stake')
  }

  render() {
    const account = store.getStore('account')
    const wallet = abbreviateAddress(account.address)

    const token = store.getYFLToken()
    const balance = getDisplayableAmountFromMinUnit(token.balance, token.decimals, 1)
    const stakedBalance = getDisplayableAmountFromMinUnit(token.stakedBalance, token.decimals, 1)
    const { now } = this.state
    const { currentCampaignEndBlock, currentCampaignStartBlock } = campaignConfig
    return (
      <div className="header">
        {token && (
          <div className="footer-social">
            <b>{`$YFL: ${balance} wallet, ${stakedBalance} staked`}</b>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Header)
