import React, { PureComponent } from 'react'
import { useWeb3React } from '@web3-react/core'
import { CONNECTION_CONNECTED } from '../web3/constants'
import Store from '../stores'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core'

const emitter = Store.emitter
const store = Store.store

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
    justifyContent: 'space-between',
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
    lineHeight: '150%',
  },
})

class Unlock extends PureComponent {
  render() {
    const { classes, redirectUrl, title } = this.props
    return (
      <div className={classes.root}>
        <MyComponent classes={classes} redirectUrl={redirectUrl} title={title} />
      </div>
    )
  }
}

function onConnectionClicked(currentConnector, setActivatingConnector, activate) {
  setActivatingConnector(currentConnector)
  activate(currentConnector)
}

function MyComponent({ classes, redirectUrl, title }) {
  const context = useWeb3React()
  const localContext = store.getStore('web3context')
  var localConnector = null
  if (localContext) {
    localConnector = localContext.connector
  }
  const { connector, library, account, activate, active, error } = context
  var connectorsByName = store.getStore('connectorsByName')

  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  React.useEffect(() => {
    if (account && active && library) {
      store.setStore({ account: { address: account }, web3context: context })
      emitter.emit(CONNECTION_CONNECTED)
    }
  }, [account, active, context, library])

  return (
    <>
      {['MetaMask'].map((name) => {
        const currentConnector = connectorsByName[name]
        const disabled = !!activatingConnector || !!error
        return (
          <Button
            className="unconnected"
            onClick={() => {
              onConnectionClicked(currentConnector, setActivatingConnector, activate)
            }}
            disabled={disabled}
          >
            {title}
          </Button>
        )
      })}
    </>
  )
}

export default withStyles(styles)(Unlock)
