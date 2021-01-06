import React, { PureComponent } from "react";
import { withStyles } from '@material-ui/core/styles';

import { ERROR, APPROVE, APPROVE_RETURNED } from '../web3/constants'
import Store from "../stores";
import Spinner from "../components/Spinner";

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const waffleImg = require('../assets/images/200824_wafflesEmoji.svg');

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
  waffleImg: {
    width: '160px',
    height: '160px',
  },
  bigTitle: {
    fontSize: '40px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '500',
    textAlign: 'center',
  }
});

class Approve extends PureComponent {
  state = {}

  getMemeId = () => {
    const { match } = this.props;
    return match && match.params.id;
  }

  async componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(APPROVE_RETURNED, this.showHash);

    const asset = store.getYFLToken();
    const payload = { type: APPROVE, content: { asset, amount: asset.balance } };

    this.setState({ loading: true })
    const approved = await store.checkApproval(payload);
    this.setState({ loading: false })

    if (approved) {
      this.handleOnApproved();
    }
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(APPROVE_RETURNED, this.showHash);
  };

  handleOnApproved = () => {
    const { history, isForCreate } = this.props;
    history.replace(isForCreate ? `/create/stake` : `/details/${this.getMemeId()}/stake`);
  }

  showHash  = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      that.setState( { snackbarMessage: txHash, snackbarType: 'Hash' })
      this.handleOnApproved();
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

  handleApprove = () => {
    this.setState({ loading: true })
    const asset = store.getYFLToken();
    dispatcher.dispatch({ type: APPROVE, content: { asset, amount: asset.balance } })
  }

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    return (
      <div className={ classes.root }>
        {loading ? (
          <Spinner />
        ) : (
          <div className={classes.container}>
            <div className={classes.bigTitle}>⭕ Approve them Waffles ✅</div>
            <div className={classes.title}>We need your approval so we can put<br/>your $YFL into the Ballot Box</div>
            <img className={classes.waffleImg} src={waffleImg} alt='Waffles' />
            <button
              className="round-button"
              onClick={this.handleApprove}
            >
              <div className="round-button-text">Approve $YFL</div>
            </button>
          </div>
        )}
      </div>
    )
  };
}

export default withStyles(styles)(Approve);
