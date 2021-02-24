import React, { PureComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { abbreviateAddress } from '../web3/utils'
import Unlock from './Create/Unlock'

import Store from '../stores'
import {
  ERROR,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  GET_LEADERBOARD_RETURNED,
  GET_LEADERBOARD,
  CONNECTION_CONNECTED,
} from '../web3/constants'
import Spinner from '../components/Spinner'

const { store, emitter, dispatcher } = Store

const styles = () => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 200,
  },
})

class Leaderboards extends PureComponent {
  componentDidMount() {
    const account = store.getStore('account')

    emitter.on(ERROR, this.errorReturned)
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected)

    if (account && account.address) {
      dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
    }
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned)
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected)
  }

  connectionConnected = () => {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected)

    const account = store.getStore('account')
    if (account && account.address) {
      dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
    }
  }

  errorReturned = () => {
    this.setState({ loading: false })
  }

  leaderboardReturned = () => {
    emitter.removeListener(GET_LEADERBOARD_RETURNED, this.leaderboardReturned)
    this.setState({ redraw: true })
  }

  proposalsReturned = () => {
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.on(GET_LEADERBOARD_RETURNED, this.leaderboardReturned)
    dispatcher.dispatch({ type: GET_LEADERBOARD, content: {} })
  }

  render() {
    const { classes } = this.props

    const account = store.getStore('account')
    const connected = account && account.address
    if (!connected) {
      return (
        <div style={{ width: '100%', height: '480px' }}>
          <Unlock redirectUrl="/leaderboards" title="Welcome to Leaderboard!" />
        </div>
      )
    }

    const leaderboard = store.getStore('leaderboard') || []
    if (!leaderboard.length) {
      return (
        <div className={classes.root}>
          <Spinner />
        </div>
      )
    }

    return (
      <Grid container className="f-w leaderboards justify-center">
        <table className="leaderboards-table">
          <tr>
            <th>Rank</th>
            <th>Post ID</th>
            <th>Poster</th>
            <th>Votes For</th>
            <th>Votes against</th>
            <th>Voters</th>
            <th>Adj. Factor</th>
            <th>Score</th>
          </tr>
          {leaderboard.map((item, index) => (
            <tr>
              <td>{index}</td>
              <td>{item.id}</td>
              <td>
                <Typography
                  variant="subtitle1"
                  dangerouslySetInnerHTML={{
                    __html: `<a target="_blank" href="https://etherscan.io/address/${item.poster}">${abbreviateAddress(
                      item.poster
                    )}</a>`,
                  }}
                />
              </td>
              <td>{parseFloat(item.votesFor || '0').toFixed(2)}</td>
              <td>{parseFloat(item.votesAgainst || '0').toFixed(2)}</td>
              <td>{item.voters || 0}</td>
              <td>{(item.factor || 0).toFixed(2)}</td>
              <td>{(item.score || 0).toFixed(2)}</td>
            </tr>
          ))}
        </table>
      </Grid>
    )
  }
}

export default withStyles(styles)(Leaderboards)
