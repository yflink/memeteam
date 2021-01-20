import React, { PureComponent } from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { abbreviateAddress } from "../web3/utils";

import Store from "../stores";
import { ERROR, GET_PROPOSALS, GET_PROPOSALS_RETURNED, GET_LEADERBOARD_RETURNED, GET_LEADERBOARD } from "../web3/constants";
import Spinner from "../components/Spinner";

const { store, emitter, dispatcher } = Store;

const styles = () => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 200,
  },
});

class Leaderboards extends PureComponent {
  componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
  };
  
  errorReturned = () => {
    this.setState({ loading: false })
  };

  leaderboardReturned = () => {
    emitter.removeListener(GET_LEADERBOARD_RETURNED, this.leaderboardReturned)
    this.setState({ redraw: true });
  }

  proposalsReturned = () => {
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.on(GET_LEADERBOARD_RETURNED, this.leaderboardReturned)
    dispatcher.dispatch({ type: GET_LEADERBOARD, content: {} })
  }

  render () {
    const { classes } = this.props;
    
    const leaderboard = store.getStore('leaderboard') || []
    if (!leaderboard.length) {
      return (
        <div className={ classes.root }>
          <Spinner />
        </div>
      );
    }

    return (
      <Grid container className="f-w leaderboards justify-center">
        <table>
          <tr>
            <th>Rank</th>
            <th>Post ID</th>
            <th>Poster</th>
            <th>Votes For</th>
            <th>Votes against</th>
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
                  dangerouslySetInnerHTML={{ __html: `Posted by: <a target="_blank" href="https://etherscan.io/address/${item.poster}">${abbreviateAddress(item.poster)}</a>`}} 
                />
              </td>
              <td>{item.votesFor}</td>
              <td>{item.votesAgainst}</td>
              <td>{item.factor}</td>
              <td>{item.score}</td>
            </tr>
          ))}
        </table>
      </Grid>
    );
  }
}

export default withStyles(styles)(Leaderboards);
