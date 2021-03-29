import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import { CONNECTION_CONNECTED, GET_BALANCES_RETURNED, NOW_TIMESTAMP_UPDATED } from '../../web3/constants'
import Store from '../../stores'
import { abbreviateAddress, getDisplayableAmountFromMinUnit } from '../../web3/utils'
import './styles.css'
import Button from '@material-ui/core/Button'
import Unlock from '../../containers/Unlock'
import { CloseSVG, InfoSVG, SettingsSVG, ToolsSVG, YFLSVG } from '../SVG'
import moment from 'moment'

const store = Store.store
const emitter = Store.emitter

class Header extends PureComponent {
  state = { menu: false, connected: false }

  componentDidMount() {
    store.resetTimer()
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned)
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow)
    emitter.on(CONNECTION_CONNECTED, this.updateConnection)
  }

  componentWillUnmount() {
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned)
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow)
    emitter.on(CONNECTION_CONNECTED, this.updateConnection)
  }

  balancesReturned = () => {
    this.setState({ redraw: true })
  }

  updateNow = () => {
    let now = moment().unix()
    this.setState({ now: now })
  }

  updateConnection = () => {
    this.setState({ connected: true })
  }

  handleGoToStake = () => {
    const { history } = this.props
    history.replace('/stake')
  }

  handleToggle = () => {
    this.setState({ menu: !this.state.menu })
  }

  render() {
    const account = store.getStore('account')
    const wallet = abbreviateAddress(account.address)

    const token = store.getYFLToken()
    const balance = getDisplayableAmountFromMinUnit(token.balance, token.decimals, 2)
    const stakedBalance = getDisplayableAmountFromMinUnit(token.stakedBalance, token.decimals, 2)
    return (
      <div className="header">
        {token && account && account.address ? (
          <>
            <div className="submit-button">
              <Button className="button-main" href="/#/create">
                submit your meme
              </Button>
            </div>
            <div className="account">
              <div className="balance">
                YFL: {balance}, {stakedBalance} staked
              </div>
              <div className="address">{wallet}</div>
            </div>
          </>
        ) : (
          <div className="account connect">
            <Unlock redirectUrl="/" title="Unconnected" />
          </div>
        )}
        <div className="menu">
          <span className="menu-toggle" onClick={this.handleToggle}>
            <SettingsSVG />
          </span>
          {this.state.menu && (
            <nav className="menu-container">
              <ul className="menu-list">
                <li className="menu-item">
                  <a href="/about" title="About">
                    <InfoSVG /> About
                  </a>
                </li>
                <li className="menu-item">
                  <a href="/tutorial" title="Tutorial">
                    <ToolsSVG /> Tutorial
                  </a>
                </li>
                <li className="menu-item">
                  <a href="/unstake" title="Unstake">
                    <CloseSVG /> Unstake
                  </a>
                </li>
                <li className="menu-item">
                  <a href="https://linkswap.app" target="_blank" rel="noopener noreferrer" title="LINKSWAP">
                    <YFLSVG /> Linkswap
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
