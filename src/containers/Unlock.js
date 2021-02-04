import React, { PureComponent } from 'react'
import { useWeb3React } from '@web3-react/core'
import { CONNECTION_CONNECTED } from '../web3/constants'
import Store from '../stores'
import Button from '@material-ui/core/Button'

const emitter = Store.emitter
const store = Store.store

class Unlock extends PureComponent {
  render() {
    const { redirectUrl, title, type } = this.props
    return (
      <>
        <MyComponent redirectUrl={redirectUrl} title={title} type={type} />
      </>
    )
  }
}

function onConnectionClicked(currentConnector, setActivatingConnector, activate) {
  setActivatingConnector(currentConnector)
  activate(currentConnector)
}

function MyComponent({ type, title }) {
  const context = useWeb3React()
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

  const classname = type === 'main' ? 'button-main' : 'button-secondary'

  return (
    <>
      {['MetaMask'].map((name) => {
        const currentConnector = connectorsByName[name]
        const disabled = !!activatingConnector || !!error
        return (
          <Button
            className={classname}
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

export default Unlock
