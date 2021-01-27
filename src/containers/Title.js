import React, { PureComponent } from "react";
import { withStyles } from '@material-ui/core/styles';
import {TextField} from '@material-ui/core';
import * as _ from 'lodash';

import Store from "../stores";
import { ERROR, PROPOSE, PROPOSE_CONFIRMED, GET_PROPOSALS, GET_PROPOSALS_RETURNED, GET_LEADERBOARD } from '../web3/constants'
import Spinner from "../components/Spinner";

const pepeAmazeImg = require('../assets/images/200824_pepeAmaze.png');

const store = Store.store
const emitter = Store.emitter
const dispatcher = Store.dispatcher

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
    padding: '16px 64px',
  },
  imgurImg: {
    width: '280px',
    objectFit: 'contain',
    objectPosition: 'top',
  },
  pepeAmazeImg: {
    width: '160px',
    height: '160px',
  },
  bigTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

class Title extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(PROPOSE_CONFIRMED, this.proposeConfirmed);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(PROPOSE_CONFIRMED, this.proposeConfirmed);
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
  };

  proposeConfirmed  = () => {
    // pull memes to get newly submitted meme
    // register GET_PROPOSALS_RETURNED here to pull after proposal is confirmed 
    this.setState({ loading: false })
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
  };

  errorReturned = () => {
    this.setState({ loading: false })
  };

  handleTitleChange = (event) => {
    const { value } = event.target;
    this.setState({ title: value });
  }

  handlePropose = () => {
    this.setState({ urlError: false })
    const { title } = this.state
    store.setStore({ creatingMemeTitle: title });
    this.setState({ loading: true })
    dispatcher.dispatch({ type: PROPOSE, content: { url: store.getCreatingMemeLink() } });
  }

  proposalsReturned = () => {
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    dispatcher.dispatch({ type: GET_LEADERBOARD, content: {} })

    const { history } = this.props;

    const memes = store.getMemes();
    const account = store.getStore('account')
    const title = store.getStore('creatingMemeTitle');

    const newMemesCandidates = memes
      .filter(meme => meme.proposer.toUpperCase() === account.address.toUpperCase())
      .filter(meme => meme.title === title)
    if (newMemesCandidates.length === 0) {
      alert('Failed to fetch newly submitted meme');
      return;
    }

    const newMeme = _.sortBy(newMemesCandidates, 'start')[0];
    history.replace(`/create/tweet/${newMeme.id}`);
  }

  render() {
    const { classes } = this.props;
    const { title, loading } = this.state;
    const creatingMemeLink = store.getStore('creatingMemeLink');
    const extensionStartIndex = creatingMemeLink.lastIndexOf('.');
    var isVideo = false;
    var extension = creatingMemeLink.substring(extensionStartIndex + 1, creatingMemeLink.length);
    extension = extension.toLowerCase();
    if (extension === 'mp4' || extension === 'mp3' || extension === 'ogg' || extension === 'webm') {
      isVideo = true;
      extension = 'video/' + extension;
    }

    return (
      <div className={ classes.root }>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {
              isVideo ? <video className={classes.imgurImg} width="320" height="150" controls>
                          <source src={creatingMemeLink} type={extension}></source>
                        </video> : <img className={classes.imgurImg} src={creatingMemeLink} alt='Meme' />
            }
            
            <div className={classes.container}>
              <div className={classes.bigTitle}>Meme Ready To Upload</div>
              <img className={classes.pepeAmazeImg} src={pepeAmazeImg} alt='Amaze' />
              <div className={classes.bigTitle}>Give your meme a title<br/>(Optional)</div>
              <TextField
                fullWidth
                className={ classes.input }
                value={ title }
                onChange={ this.handleTitleChange }
                variant="outlined"
              />
              <button
                className="round-button"
                onClick={this.handlePropose}
              >
                <div className="round-button-text">Upload Meme</div>
              </button>
            </div>
          </>
        )}
      </div>
    )
  };
}

export default withStyles(styles)(Title);
