import React, { PureComponent } from 'react'
import { useWeb3React } from '@web3-react/core'
import { CONNECTION_CONNECTED, NOW_TIMESTAMP_UPDATED } from '../web3/constants'
import Store from '../stores'
import Button from '@material-ui/core/Button'
import moment from 'moment'
import { CircularProgress } from '@material-ui/core'
const emitter = Store.emitter
const store = Store.store

export default class Unlock extends PureComponent {
  state = { now: 0 }

  componentDidMount() {
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow)
  }

  componentWillUnmount() {
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow)
  }

  updateNow = () => {
    let now = moment().unix()
    this.setState({ now: now })
  }

  render() {
    const { redirectUrl, title, type } = this.props
    const { now } = this.state
    return <MyComponent redirectUrl={redirectUrl} title={title} type={type} />
  }
}

function onConnectionClicked(currentConnector, setActivatingConnector, activate) {
  setActivatingConnector(currentConnector)
  activate(currentConnector)
}

function MyComponent({ redirectUrl, type, title }) {
  const context = useWeb3React()
  const { connector, library, account, activate, active, error } = context
  var connectorsByName = store.getStore('connectorsByName')

  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  if (account && active && library) {
    store.setStore({ account: { address: account }, web3context: context })
    emitter.emit(CONNECTION_CONNECTED)
  }
  const { ethereum } = window
  const classname = type === 'main' ? 'button-main' : 'button-secondary'
  return (
    <>
      {['MetaMask'].map((name) => {
        const currentConnector = connectorsByName[name]
        const activating = currentConnector === activatingConnector
        const connected = !!(ethereum && ethereum.selectedAddress)
        const disabled = !!activatingConnector || !!error
        if (connected && activating) {
          window.location.href = redirectUrl
          return <CircularProgress size={15} style={{ marginRight: '10px' }} />
        } else {
          return (
            <div key={name}>
              <Button
                className={classname}
                onClick={() => {
                  onConnectionClicked(currentConnector, setActivatingConnector, activate)
                }}
                disabled={disabled}
              >
                {title}
              </Button>
            </div>
          )
        }
      })}
    </>
  )
}
