import React, { PureComponent } from "react";
import { withStyles } from '@material-ui/core/styles';

import { ERROR, VOTE_FOR_CONFIRMED, VOTE_FOR } from "../web3/constants";
import Store from "../stores";
import Spinner from "../components/Spinner";

const emitter = Store.emitter
const store = Store.store
const dispatcher = Store.dispatcher

const pepeAmazeImg = require('../assets/images/200824_pepeAmaze.png');
const liftOffPepeImg = require('../assets/images/200804_liftOffPepe.png');

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
  liftOffPepeImg: {
    width: '280px',
  },
  pepeAmazeImg: {
    width: '160px',
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
  }
});

class AllSet extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(VOTE_FOR_CONFIRMED, this.voteForConfirmed)
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(VOTE_FOR_CONFIRMED, this.voteForConfirmed)
  };

  getMemeId = () => {
    const { match } = this.props;
    return match && match.params.id;
  }

  handleContinue = () => {
    const { history, isForCreate, isForDetail } = this.props;
    const meme = store.getMemeForId(this.getMemeId());
    if (isForCreate) {
      history.replace('/create?isFromStake=true');
    } else if (isForDetail) {
      dispatcher.dispatch({ type: VOTE_FOR, content: { proposal: meme } })
      this.setState({ loading: true });
    } else {
      history.replace('/');
    }
  }

  voteForConfirmed = () => {
    emitter.removeListener(VOTE_FOR_CONFIRMED, this.voteForConfirmed)

    this.setState({ loading: false });

    const { history } = this.props;
    history.replace(`/details/${this.getMemeId()}/voted`);
  }

  errorReturned = (error) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes } = this.props;
    const { loading } = this.state;

    if (loading) {
      return (
        <div className={ classes.root }>
          <Spinner />
        </div>
      );
    }

    return (
      <div className={ classes.root }>
        <img className={classes.liftOffPepeImg} src={liftOffPepeImg} alt='Waffles' />
        <div className={classes.container}>
          <div className={classes.bigTitle}>You’re all Set!</div>
          <img className={classes.pepeAmazeImg} src={pepeAmazeImg} alt='Waffles' />
          <button
            className="round-button"
            onClick={this.handleContinue}
          >
            <div className="round-button-text">Continue</div>
          </button>
        </div>
      </div>
    )
  };
}

export default withStyles(styles)(AllSet);
