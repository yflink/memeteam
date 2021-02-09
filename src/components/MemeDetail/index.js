import React, { PureComponent } from 'react';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TimerIcon from '@material-ui/icons/AccessTime';
import classnames from 'classnames';

import './styles.css';
import { formatCountdown, getFileFromLink, openTweet } from '../../Utils';
import { getRoundedWei, abbreviateAddress, titleCheck } from "../../web3/utils";
import { NOW_TIMESTAMP_UPDATED } from '../../web3/constants';

import Store from "../../stores";
import Meme from "../Meme";
const emitter = Store.emitter
const store = Store.store

class MemeDetail extends PureComponent {
  state = {}

  async componentDidMount() {
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow);
  }

  componentWillUnmount() {
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow);
  };

  updateNow = () => {
    let now = store.getStore('now')
    this.setState({ now })
  }

  handleTweet = () => {
    const { id, title, link } = this.props;
    openTweet(id, title, getFileFromLink(link));
  }

  render() {
    const {
      id,
      link,
      title,
      proposer,
      displayName,
      totalForVotes,
      end,
      voterCount,
      myVoteCount,
      posterYFLBalance,
      posterYFLStakedBalance,
      onVote,
      leaderboardItem,
    } = this.props;

    const { now } = this.state;
    const countdown = end - now;

    return (
      <Grid
        container
        className={classnames('section meme justify-center', {
          'border-green': countdown > 0,
          'border-black': !countdown || countdown <= 0,
        })}
        direction='row'
      >
        <Grid className='detail-img-container'>
          <Meme link={link} memeClass='detail-img'/>
        </Grid>
        <Grid className='detail-desc' direction='column' justify='center' >
          <Grid  className='detail-desc-top' container direction='row' alignItems='center' justify='space-between'>
            <Typography
              variant="h6"
              dangerouslySetInnerHTML={{ __html: `Meme #${id}</b>` }}
            />
            <Button
              className="button-tween b-white"
              variant="outlined"
              onClick={this.handleTweet}
            >
              <Typography variant="p" dangerouslySetInnerHTML={{ __html: `Tweet<br>this Meme` }} />
            </Button>
          </Grid>

          <Typography 
            variant="h5" 
            dangerouslySetInnerHTML={{ __html: `<b>Title: <i>${titleCheck(title)}</i></b>`}}
            className='detail-desc-title'
          />

          <Typography 
            variant="h6" 
            dangerouslySetInnerHTML={{ __html: `<b>About the poster</b>`}} 
            className='detail-desc-subtitle'
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `Posted by: <a target="_blank" href="https://etherscan.io/address/${proposer}">${displayName?displayName: abbreviateAddress(proposer)}</a>`}} 
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `$YFL Balance: ${posterYFLBalance || '--'}`}} 
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `$YFL Staked: ${posterYFLStakedBalance || '--'}`}} 
          />

          <Typography 
            variant="h6" 
            dangerouslySetInnerHTML={{ __html: `<b>Stats for this Meme</b>`}} 
            className='detail-desc-subtitle'
          />
          <Typography
            variant="subtitle1"
            dangerouslySetInnerHTML={{ __html: `Votes: ${getRoundedWei(totalForVotes)}` }}
          />
          <Typography
            variant="subtitle1"
            dangerouslySetInnerHTML={{ __html: `Voters: ${voterCount || '--'}` }}
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `My Votes: ${myVoteCount || '--'}`}} 
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `Adjustment Factor: ${(leaderboardItem?.factor || 0).toFixed(2) || '--'}`}} 
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `Score: ${(leaderboardItem?.score || 0).toFixed(2) || '--'}`}} 
          />

          <Typography 
            variant="h6" 
            dangerouslySetInnerHTML={{ __html: `<b>Prize info</b>`}} 
            className='detail-desc-subtitle'
          />
          <Typography
            variant="subtitle1"
            dangerouslySetInnerHTML={{ __html: `Prize Tier: ${leaderboardItem?.prizeTier || '--'} YFL` }}
          />
          <Typography
            variant="subtitle1"
            dangerouslySetInnerHTML={{ __html: `Prize to poster: ${leaderboardItem?.prizeToPoster || '--'} YFL` }}
          />
          <Grid className='detail-time justify-space-between' direction='row' alignItems='flex-end'>
            <Grid container direction='row' item xs={5} >
              <TimerIcon style={{ color: countdown > 0 ? 'green' : 'red'}} />
              <Typography 
                variant="p" 
                className={countdown > 0 ? 'f-green' : 'f-red'}
                dangerouslySetInnerHTML={{ __html: formatCountdown(countdown)}}
              />
            </Grid>
            <Grid className='center' container direction='row' justify='center' alignItems='center' item xs={3}  spacing={1}>
              <Grid item>
                <Link to=''>
                  <Typography 
                    variant="p" 
                    dangerouslySetInnerHTML={{ __html: `<a onclick="window.open(this.href,'_blank');return false;" href="https://blog.yflink.io/draft-brief-operation-dry-run/">Share in the Prize</a>`}} 
                  />           
                </Link>
              </Grid>
              {countdown > 0 ? (
                <Button
                  className="button-vote b-white f-green"
                  variant="outlined"
                  onClick={() => onVote({ id })}
                >
                  <Grid container direction='column' >
                    <Typography 
                      variant="body1" 
                      dangerouslySetInnerHTML={{ __html: 'Vote'}} 
                    />
                    <Typography 
                      variant="caption"
                      dangerouslySetInnerHTML={{ __html: `for Meme #${id}`}} 
                    />
                  </Grid>
                </Button>
              ) : (
                <Button
                  className="button-vote b-white f-red"
                  variant="outlined"
                >
                  <Grid container direction='column' >
                    <Typography 
                      variant="body1" 
                      dangerouslySetInnerHTML={{ __html: 'Voting'}} 
                    />
                    <Typography 
                      variant="body1"
                      dangerouslySetInnerHTML={{ __html: 'Closed'}} 
                    />
                  </Grid>
                </Button>
              )}
            </Grid>
          </Grid>
  
        </Grid>
      </Grid>
    );
  }
}

export default MemeDetail;
