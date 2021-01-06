import React, { PureComponent } from "react";
import { withStyles } from '@material-ui/core/styles';

import { GET_BALANCES_RETURNED } from "../web3/constants";

import Store from "../stores";
import { getDisplayableAmountFromMinUnit } from "../web3/utils";

const kittyImg = require('../assets/images/200824_kittieWaffles.png');
const store = Store.store
const emitter = Store.emitter

const styles = () => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent:'space-between',
    alignItems: 'center',
    padding: '32px 0',
  },
  kittyImg: {
    width: '272px',
    height: '272px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '500',
    textAlign: 'center',
  }
});

class Register extends PureComponent {
  state = { }

  getMemeId = () => {
    const { match } = this.props;
    return match && match.params.id;
  }

  componentDidMount() {
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  };

  handleGoToApprove = () => {
    const { history, isForCreate } = this.props;
    history.replace(isForCreate ? `/create/approve` :  `/details/${this.getMemeId()}/approve`);
  }

  balancesReturned = () => {
    this.setState({ redraw: true });
  }

  render() {
    const { classes } = this.props;
    const token = store.getYFLToken();
    return (
      <div className={ classes.root }>
        <div className={classes.container}>
          <img className={classes.kittyImg} src={kittyImg} alt='Kitty Waffles' />
          <div className={classes.title}>💪 You have {getDisplayableAmountFromMinUnit(token.balance, token.decimals, 6) } Waffles! 🚀</div>
          <button
            className="round-button"
            onClick={this.handleGoToApprove}
          >
            <div className="round-button-text">🗳️Register to Vote<br/>or Submit 🗳️</div>
          </button>
        </div>
      </div>
    )
  };
}

export default withStyles(styles)(Register);
