import React, { PureComponent } from "react";
import { withStyles } from '@material-ui/core/styles';

import Store from "../stores";
import { GET_PROPOSALS_RETURNED } from '../web3/constants'
import { getFileFromLink, openTweet } from "../Utils";
import { getDisplayableAmountFromMinUnit } from "../web3/utils";
import Meme from "../components/Meme";

const evilKermitImg = require('../assets/images/200824_evilKermit.jpg');

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
    justifyContent:'space-between',
    alignItems: 'center',
    padding: '16px 16px 16px 64px',
  },
  imgurImg: {
    width: '280px',
    objectFit: 'contain',
    objectPosition: 'top',
  },
  evilKermitImg: {
    width: '360px',
    height: '204px',
  },
  bigTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: '22px',
    fontWeight: '500',
    textAlign: 'center',
  },
  smallTitle: {
    fontSize: '18px',
    fontWeight: '500',
    textAlign: 'center',
  },
  tweetContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    padding: '16px',
  }
});

class Voted extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
  }

  componentWillUnmount() {
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
  };

  proposalsReturned = () => {
    this.setState({ redraw: true })
  }

  getMemeId = () => {
    const { match } = this.props;
    return match && match.params.id;
  }

  handleDone = () => {
    const { history } = this.props;
    history.goBack();
  }

  handleTweet = () => {
    const memeId = this.getMemeId();
    const meme = store.getMemeForId(memeId);
    openTweet(memeId, meme.title, getFileFromLink(meme.link));
  }

  render() {
    const { classes } = this.props;
    const memeId = this.getMemeId();
    const meme = store.getMemeForId(memeId);
    const asset = store.getYFLToken();
    if (!meme) {
      return null;
    }

    return (
      <div className={ classes.root }>
        <Meme link={meme.link} memeClass={classes.imgurImg} />
        <div className={classes.container}>
          {/* <div className={classes.bigTitle}>✅ *{getRoundedWei(meme.totalForVotes)} Votes!* ✅</div> */}
          <div className={classes.bigTitle}>
            ✅ You Voted with {getDisplayableAmountFromMinUnit(asset.stakedBalance, asset.decimals, 6)} Staked YFL For Meme {memeId}✅
          </div>
          <a className={classes.bigTitle} href="https://blog.yflink.io/draft-brief-operation-dry-run/" target="blank_">Share in the prize for this meme!</a>
          <div className={classes.smallTitle}>If this meme wins, 50% of the prize will be<br/>shared pro-rata with voters for this meme</div>
          <img className={classes.evilKermitImg} src={evilKermitImg} alt='Brain' />
          <div className={classes.title}>Tweet to get more votes!  👉👉👉</div>
        </div>
        <div className={classes.tweetContainer}>
          <button className="round-button" onClick={this.handleDone}>
            <div className="round-button-text">Done</div>
          </button>
          <button
            className="round-button"
            onClick={this.handleTweet}
          >
            <div className="round-button-text">Tweet</div>
          </button>
        </div>
      </div>
    )
  };
}

export default withStyles(styles)(Voted);
