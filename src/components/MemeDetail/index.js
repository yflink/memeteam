import React, { PureComponent } from 'react';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TimerIcon from '@material-ui/icons/AccessTime';

import './styles.css';
import { formatCountdown, getFileFromImgurLink, getRootDomain, openTweet } from '../../Utils';
import { getRoundedWei, abbreviateAddress, titleCheck } from "../../web3/utils";
import { NOW_TIMESTAMP_UPDATED } from '../../web3/constants';

import Store from "../../stores";
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
    openTweet(id, title, getFileFromImgurLink(link));
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
      posterLinkBalance,
      posterYFLBalance,
      posterYFLStakedBalance,
      onVote,
    } = this.props;
    const { now } = this.state;

    const countdown = end - now;

    return (
      <Grid container className="section meme justify-center" direction='row' >
        <Grid className='detail-img-container'>
          <img className='detail-img' src={link} alt='meme detail' />
          <div className="link-overlay"><a href={link} target="_blank">{link}</a></div>
        </Grid>
        <Grid className='detail-desc' direction='column' justify='center' >
          <Grid  className='detail-desc-top' container direction='row' alignItems='center' justify='space-between'>
            <Typography
              variant="h6"
              dangerouslySetInnerHTML={{ __html: `<b>${getRoundedWei(totalForVotes)} Votes for Meme #${id}</b><br><i><font size="-0.5">(by ${voterCount || '--'} voters)</font></i>` }}
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
            dangerouslySetInnerHTML={{ __html: `<b>Stats for Meme #${id}</b>`}} 
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `Posted by: <a target="_blank" href="https://etherscan.io/address/${proposer}">${displayName?displayName: abbreviateAddress(proposer)}</a>`}} 
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `Poster $Link Balance: ${posterLinkBalance || '--'}`}} 
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `Poster $YFL Balance: ${posterYFLBalance || '--'}`}} 
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `Poster $YFL Staked in Gov Rewards: ${posterYFLStakedBalance || '--'}`}} 
          />
          <Typography 
            variant="subtitle1" 
            dangerouslySetInnerHTML={{ __html: `My Votes for this Meme: ${myVoteCount || '--'}`}} 
          />                    
          <Grid className='detail-time justify-space-between' direction='row' alignItems='flex-end'>
            <Grid container direction='row' item xs={5} >
              <TimerIcon />
              <Typography 
                variant="p" 
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
              <Button
                className="button-vote b-white"
                variant="outlined"
                onClick={() => onVote({ id })}
              >
                {countdown > 0 ? (
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
                ) : (
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
                )}
              </Button>
            </Grid>
          </Grid>
  
        </Grid>
      </Grid>
    );
  }
}

export default MemeDetail;
