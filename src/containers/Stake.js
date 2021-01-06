import React, { PureComponent } from "react";
import { withStyles } from '@material-ui/core/styles';
import bigInt from 'big-integer';
import {TextField, Typography, Snackbar} from '@material-ui/core';
import Spinner from "../components/Spinner";

import Store from "../stores";
import { ERROR, STAKE, STAKE_CONFIRMED, GET_BALANCES_RETURNED } from '../web3/constants'
import { toFixed } from "../web3/utils";

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const sergeyImg = require('../assets/images/200824_sergey.png');

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
  sergeyImg: {
    width: '260px',
    height: '160px',
  },
  bigTitle: {
    fontSize: '40px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: '22px',
    fontWeight: '500',
    textAlign: 'center',
  },
  stakeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    padding: '0 64px',
  },
  max: {
    cursor: 'pointer',
    paddingBottom: '8px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  input: {
    flex: 1,
    paddingRight: '16px',
  }
});

class Stake extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(STAKE_CONFIRMED, this.proposeConfirmed);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(STAKE_CONFIRMED, this.proposeConfirmed);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  };

  balancesReturned = () => {
    this.setState({ redraw: true });
  }

  proposeConfirmed = () => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      that.setState( { snackbarType: 'Hash' })
      that.handleGoToAllSet()
    })
  };

  errorReturned = (error) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  getMemeId = () => {
    const { match } = this.props;
    return match && match.params.id;
  }

  handleGoToAllSet = () => {
    const { history, isForCreate, isForDetail } = this.props;
    history.replace(isForCreate ? (
      `/create/allset`
    ) : isForDetail ? (
      `/details/${this.getMemeId()}/allset`
    ) : (
      `/stake/allset`
    ));
  }

  handleStake = () => {
    this.setState({ amountError: false })
    const asset = store.getYFLToken();
    const amountString = this.state[asset.id + '_stake']

    if (!amountString) {
      alert('Invalid amount!')
      return;
    }

    const amount = bigInt((parseFloat(amountString) * 10**asset.decimals).toString())
    const token = store.getYFLToken();

    if (bigInt(amount + token.stakedBalance) < store.getMinYFLToStakeToMinUnit() ) {
      alert('Insufficient amount!')
      return;
    }

    if(amount > token.balance) {
      alert('You have insufficient YFLs to stake this amount!')
      return;
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: STAKE, content: { asset: asset, amount: amount } })
  }

  handleChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  setAmount = (id, type, balance) => {
    const bal = toFixed(balance, 18, 6)
    let val = []
    val[id + '_' + type] = bal
    this.setState(val)
  }

  renderStake = () => {
    const { classes } = this.props;
    const { snackbarMessage, loading } = this.state
    const asset = store.getYFLToken();
    const type = 'stake';
    const amount = this.state[asset.id + '_' + type]
    const amountError = this.state[asset.id + '_' + type + '_error']

    return (
      <div className={ classes.stakeContainer }>
        <Typography
          variant='h5'
          onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.balance : bigInt())) } }
          className={ classes.max }
          noWrap
        >
          {'Max: '+ ( asset && asset.balance ? toFixed(asset.balance, asset.decimals, 6) : '0') } { asset ? asset.symbol : '' }
        </Typography>
        <div className={classes.inputContainer}>
          <TextField
            fullWidth
            disabled={ loading }
            className={ classes.input }
            id={ '' + asset.id + '_' + type }
            value={ amount }
            error={ amountError }
            onChange={ this.handleChange }
            placeholder="0.00"
            variant="outlined"
            type="number"
          />
          <button
            className="round-button"
            onClick={this.handleStake}
          >
            <div className="round-button-text">🗳️Stake! 🗳️</div>
          </button>
        </div>
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open autoHideDuration={6000} />
  };

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    return (
      <div className={ classes.root }>
        {loading ? (
          <Spinner />
        ) : (
          <div className={classes.container}>
            <div className={classes.bigTitle}>Stake At Least 0.12 YFL To Continue</div>
            <div className={classes.title}>
              If you vote or submit a meme, you can take your $YFL out after 3 days
              <br/>
              Otherwise, you can take them out at any time
            </div>
            <img className={classes.sergeyImg} src={sergeyImg} alt='Waffles' />
            {this.renderStake()}
          </div>
        )}
      </div>
    )
  };
}

export default withStyles(styles)(Stake);
