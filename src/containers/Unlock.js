import React, { PureComponent } from "react";
import { withStyles } from '@material-ui/core/styles';
import {
  CircularProgress
} from '@material-ui/core';
import { Redirect } from "react-router-dom";
import { getRootDomain } from '../Utils';

import {
  useWeb3React,
} from "@web3-react/core";

import {
  CONNECTION_CONNECTED
} from '../web3/constants'

import Store from "../stores";

const emitter = Store.emitter
const store = Store.store

const pepeMaskImage = require('../assets/images/200824_pepeMask.png');

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
  unlockImg: {
    width: '160px',
    height: '160px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: '150%'
  }
});

class Unlock extends PureComponent {
  render() {
    const { classes, redirectUrl, title } = this.props;
    return (
      <div className={ classes.root }>
        <MyComponent
          classes={classes}
          redirectUrl={redirectUrl}
          title={title}
        />
      </div>
    )
  };
}

function onConnectionClicked(currentConnector, setActivatingConnector, activate) {
  setActivatingConnector(currentConnector);
  activate(currentConnector);
}

function MyComponent({ classes, redirectUrl, title }) {

  const context = useWeb3React();
  const localContext = store.getStore('web3context');
  var localConnector = null;
  if (localContext) {
    localConnector = localContext.connector
  }
  const {
    connector,
    library,
    account,
    activate,
    active,
    error
  } = context;
  var connectorsByName = store.getStore('connectorsByName')

  const [activatingConnector, setActivatingConnector] = React.useState();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  React.useEffect(() => {
    if (account && active && library) {
      store.setStore({ account: { address: account }, web3context: context })
      emitter.emit(CONNECTION_CONNECTED)
    }
  }, [account, active, context, library]);

  // React.useEffect(() => {
  //   if (storeContext && storeContext.active && !active) {
  //     console.log("we are deactive: "+storeContext.account)
  //     store.setStore({ account: {}, web3context: null })
  //   }
  // }, [active, storeContext]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  // const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  // useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        {title || <>Welcome to The Meme Team<br/>Win Prizes When You Upload and/or Vote on Memes</>}
      </div>
      <img className={classes.unlockImg} src={pepeMaskImage} alt='Pepe Mask' />
      {['MetaMask'].map(name => {
        const currentConnector = connectorsByName[name];
        const activating = currentConnector === activatingConnector;
        const connected = (currentConnector === connector||currentConnector === localConnector);
        const disabled = !!activatingConnector || !!error;

        return (
          <div key={name}>
            <button
              className="round-button"
              onClick={() => {
                onConnectionClicked(currentConnector, setActivatingConnector, activate)
              }}
              disabled={ disabled }>
              <div className="round-button-text">Connect Metamask to Continue</div>
              {activating && <CircularProgress size={ 15 } style={{marginRight: '10px'}} />}
              {(!activating && connected) && (
                <Redirect to={redirectUrl} />
              )}
            </button>
          </div>
        )
      }) }
    </div>
  )
}

export default withStyles(styles)(Unlock);
