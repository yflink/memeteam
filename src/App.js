import React, { PureComponent } from 'react';
import { HashRouter  as Router,  Route,  Switch,  Redirect, Link } from "react-router-dom";
import {
  Web3ReactProvider,
} from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import './App.css';

import Home from "./containers/Home";
import { injected } from "./web3/connectors";
import { CONNECTION_CONNECTED, GET_BALANCES, GET_BALANCES_RETURNED, CONFIGURE } from './web3/constants';

import { logo } from './assets'
import Store from "./stores";
import DetailsContainer from './containers/DetailsContainer';
import CreateContainer from './containers/CreateContainer';
import Header from './components/Header';

import { getDisplayableAmountFromMinUnit } from './web3/utils';
import Stake from './containers/Stake';
import AllSet from './containers/AllSet';
import StakeContainer from './containers/StakeContainer';

const dispatcher = Store.dispatcher
const emitter = Store.emitter
const store = Store.store

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

class App extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);

    injected.isAuthorized().then(isAuthorized => { 
      if (isAuthorized) {
        injected.activate()
        .then((a) => {
          store.setStore({ account: { address: a.account }, web3context: { library: { provider: a.provider } } })
          emitter.emit(CONNECTION_CONNECTED)

          dispatcher.dispatch({ type: CONFIGURE })
          dispatcher.dispatch({type: GET_BALANCES, content: {}})

          // console.log(a)
        })
        .catch((_e) => {
          // console.log(e)
        })
      } else {
        store.setStore({ account: { }, web3context: null })
      }
    });
  }

  componentWillUnmount() {
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  balancesReturned = () => {
    this.setState({ redraw: true });
  }

  render() {
    const token = store.getYFLToken();
    const balance = getDisplayableAmountFromMinUnit(token.balance, token.decimals, 1);
    const stakedBalance = getDisplayableAmountFromMinUnit(token.stakedBalance, token.decimals, 1);
    return (
      <div className="App">  
        <Web3ReactProvider getLibrary={getLibrary}>
          <Router basename={`${process.env.PUBLIC_URL}/`}> 
            <div className="app-logo-container" > 
              <Link to='/'>
                <div className="app-logo">
                  <img className="img" src={logo} alt='logo' />
                </div>
              </Link>
              <a className="footer-social" href="/">Home</a>
              <a className="footer-social" target="_blank" href="https://blog.yflink.io/memeteam/">About</a>
              <a className="footer-social" target="_blank" href="https://vimeo.com/493755008?autoplay=1">Tutorial</a>
              {token && (
                <div className="footer-social"><b>
                  {`$YFL: ${balance} wallet, ${stakedBalance} staked`}
                </b></div>
              )}
              <div style={{ flex: 1}} />
              <Header />
            </div>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/details" component={DetailsContainer} />
              <Route path="/create" component={CreateContainer} />
              <Route path="/stake" component={StakeContainer} />
              <Redirect to="/" />
            </Switch>
          </Router> 
        </Web3ReactProvider>
      </div>
    );
  }
}

export default App;
