import React, { PureComponent } from "react";
import { Redirect } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

import Store from "../stores";
import { GET_BALANCES, GET_BALANCES_RETURNED } from "../web3/constants";
import Spinner from "../components/Spinner";

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const donkeyWafflesImg = require('../assets/images/200824_donkeyWaffles.png');

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
  donkeyImg: {
    width: '448px',
    height: '272px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '500',
    textAlign: 'center',
  }
});

class Buy extends PureComponent {
  state = {}

  constructor(props) {
    super(props)

    dispatcher.dispatch({type: GET_BALANCES, content: {}})
  }

  componentDidMount() {
    this.balanceCheckTimer = setInterval(() => {
      dispatcher.dispatch({type: GET_BALANCES, content: {}})
    }, 3000);

    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    clearInterval(this.balanceCheckTimer);

    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  };

  balancesReturned = () => {
    this.setState({ redraw: true })
  }

  handleGoToBuy = () => {
    window.open('https://1inch.exchange/#/r/0xE69A81b96FBF5Cb6CAe95d2cE5323Eff2bA0EAE4/ETH/YFL', '_blank');
  }

  getMemeId = () => {
    const { match } = this.props;
    return match && match.params.id;
  }

  render() {
    const { classes, isForCreate } = this.props;
    const token = store.getYFLToken();

    if (store.hasEnoughYFL()) {
      return <Redirect to={isForCreate ? '/create/register' : `/details/${this.getMemeId()}/register`} />
    }

    return (
      <div className={ classes.root }>
        {!token ? (
          <Spinner />
        ) : (
          <div className={classes.container}>
            <img className={classes.donkeyImg} src={donkeyWafflesImg} alt='Donkey Waffles' />
            <div className={classes.title}>You need at least {store.MIN_YFL_TO_STAKE} $YFL (Waffles 😛)<br/>to Submit a Meme or Vote for a Meme</div>
            <button
              className="round-button"
              onClick={this.handleGoToBuy}
            >
              <div className="round-button-text">Buy $YFL on 1inch</div>
            </button>
          </div>
        )}
      </div>
    )
  };
}

export default withStyles(styles)(Buy);
