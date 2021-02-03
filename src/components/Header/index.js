import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Link, withRouter } from "react-router-dom";

import { GET_BALANCES_RETURNED, NOW_TIMESTAMP_UPDATED } from "../../web3/constants";
import Store from "../../stores";
import { abbreviateAddress } from "../../web3/utils";
import { formatCountdown } from "../../Utils";
import { campaignConfig } from "../../campaign.config";
import StartBlockLink from "../StartBlockLink";

import './styles.css';

const store = Store.store
const emitter = Store.emitter

class Header extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow);
  }

  componentWillUnmount() {
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow);
  };

  balancesReturned = () => {
    this.setState({ redraw: true })
  }

  updateNow = () => {
    let now = store.getStore('now');
    this.setState({ now });
  }

  handleGoToStake = () => {
    const { history } = this.props;
    history.replace('/stake');
  };

  render () {
    const account = store.getStore('account')
    const wallet = abbreviateAddress(account.address);

    const { now } = this.state;
    const { currentCampaignEndBlock, currentCampaignStartBlock } = campaignConfig;
    return (
      <div className="header">
        <Link to="/create">
          <Button
            className="header-button b-white"
            variant="outlined"
            startIcon={<AddBoxIcon />}
          >
            Upload Meme
          </Button>
        </Link>
        {now && (
          <a target="_blank" href="/">
            <Button className="header-button b-white" variant="outlined">
              {currentCampaignStartBlock > now ? (
                <>
                  STARTS AT BLOCK: <StartBlockLink startBlock={currentCampaignStartBlock} />
                </>
              ) : (
                `CURRENT CAMPAIGN ENDS IN: ${formatCountdown(currentCampaignEndBlock - now).toUpperCase()}`
              )}
            </Button>
          </a>
        )}
        <Button
          className="header-button b-white"
          variant="outlined"
          onClick={this.handleGoToStake}
        >
          Stake $YFL
        </Button>
        <a target="_blank" href="https://yflink.io/#/vote">
          <Button
            className="header-button b-white"
            variant="outlined"
          >
            Unstake $YFL
          </Button>
        </a>
        <Button
          className="header-button b-white"
          variant="outlined"
        >
          Wallet: {wallet}
        </Button>
      </div>
    )
  }
}

export default withRouter(Header);
