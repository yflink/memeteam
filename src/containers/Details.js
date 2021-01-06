import React, { PureComponent } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from "react-helmet";
import qs from 'query-string';
import { Redirect } from "react-router-dom";

import MemeDetail from '../components/MemeDetail';
import { ERROR, GET_PROPOSALS_RETURNED, VOTE_FOR, VOTE_FOR_CONFIRMED, NOW_TIMESTAMP_UPDATED } from "../web3/constants";
import Store from "../stores";
import {
  getVoterCount,
  getMyVoteCount,
  getPosterLinkBalance,
  getPosterYFLBalance,
  getPosterYFLStakedBalance,
} from '../web3/etherscan';

import { getRoundedWei } from '../web3/utils';
import { getImgurLinkFromFile } from '../Utils';
import Spinner from "../components/Spinner";
import { getFilteredMemes } from '../Utils/filters';

const emitter = Store.emitter
const store = Store.store
const dispatcher = Store.dispatcher

export const SLIDER_SETTINGS = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  // fade: true,
};

const styles = () => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
});

class Details extends PureComponent {
  state = {
    loading: false,
  }

  getMemeId = (props) => {
    const { match } = props || this.props;
    return match && match.params.id;
  }

  getMemesToShow = () => {
    const { now } = this.state;
    const memes = store.getMemes();
    const selectedMemeComparator = (meme) => '' + meme.id === this.getMemeId();
    const selectedMeme = memes.find(selectedMemeComparator);
    if (!now) {
      return [];
    }

    const openMemes = getFilteredMemes({
      memes,
      filters: {
        memeFilter: 'votes_open',
        sort: 'newest_to_oldest',
      },
      now,
    });

    if (openMemes.find(selectedMemeComparator)) {
      return openMemes;
    } else {
      return [selectedMeme, ...openMemes];
    }
  }

  slickToMeme = async () => {
    const memes = this.getMemesToShow();
    const memeId = this.getMemeId();

    this.handleSetCurrentMeme(parseInt(memeId));

    const slickId = memes.findIndex(meme => '' + meme.id === memeId);
    if (slickId > -1 && this.slider) {
      this.slider.slickGoTo(slickId, true);
    }
  }

  componentDidMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.on(VOTE_FOR_CONFIRMED, this.voteForConfirmed)
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow);

    this.slickToMeme()
  }

  componentDidUpdate(prevProps, prevState) {
    const prevMemeId = this.getMemeId(prevProps);
    const { now } = this.state;
    if (prevMemeId !== this.getMemeId() || (now && !prevState.now)) {
      this.slickToMeme()
    }
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.removeListener(VOTE_FOR_CONFIRMED, this.voteForConfirmed)
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow);
  };

  errorReturned = (error) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  proposalsReturned = () => {
    this.setState({ redraw: true })
    this.slickToMeme()
  }

  voteForConfirmed = ({ proposal }) => {
    this.setState({ loading: false });

    const { history } = this.props;
    history.push(`/details/${proposal.id}/voted`);
  };

  handleVote = (data) => {
    const { history } = this.props;
    const meme = store.getMemeForId(data.id);
    if (store.stakedEnoughYFL()) {
      if (meme) {
        dispatcher.dispatch({ type: VOTE_FOR, content: { proposal: meme } })
        this.setState({ loading: true });
      }
    } else if (store.hasEnoughYFL()) {
      history.push(`/details/${data.id}/stake`);
    } else {
      history.push(`/details/${data.id}/buy`);
    }
  }

  handleSlidedToIndex = async (slideIndex) => {
    const memes = this.getMemesToShow();
    const memeId = memes[slideIndex].id;
    this.handleSetCurrentMeme(memeId);
  }

  handleSetCurrentMeme = async (memeId) => {
    const meme = store.getMemeForId(memeId);
    if (!meme) {
      return;
    }

    this.setState({ myVoteCount: null, voterCount: null, currentMemeId: memeId });

    this.handleUpdateVoterCount(memeId);
    this.handleUpdateMyVoteCount(memeId);
    this.handleUpdatePosterLinkBalance(meme);
    this.handleUpdatePosterYFLBalance(meme);
    this.handleUpdatePosterYFLStakedBalance(meme);
  }

  handleUpdateVoterCount = async (memeId) => {
    this.setState({ voterCount: null });
    const voterCount = await getVoterCount(memeId);
    this.setState({ voterCount });
  }

  handleUpdateMyVoteCount = async (memeId) => {
    const account = store.getStore('account')

    this.setState({ myVoteCount: null });
    const myVoteCount = await getMyVoteCount(memeId, account && account.address);
    this.setState({ myVoteCount });
  }

  handleUpdatePosterLinkBalance = async (meme) => {
    this.setState({ posterLinkBalance: null });
    const posterLinkBalance = await getPosterLinkBalance(meme);
    this.setState({ posterLinkBalance });
  }

  handleUpdatePosterYFLBalance = async (meme) => {
    this.setState({ posterYFLBalance: null });
    const posterYFLBalance = await getPosterYFLBalance(meme);
    this.setState({ posterYFLBalance });
  }

  handleUpdatePosterYFLStakedBalance = async (meme) => {
    this.setState({ posterYFLStakedBalance: null });
    const posterYFLStakedBalance = await getPosterYFLStakedBalance(meme);
    this.setState({ posterYFLStakedBalance });
  }

  updateNow = () => {
    let now = store.getStore('now')
    this.setState({ now })
  }

  renderHelmet = () => {
    let params = qs.parse(this.props.location.search)
    const { title, image } = params || {};
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="twitter:title" content={title} />
        <meta name="twitter:image" content={getImgurLinkFromFile(image)} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="og:type" content="website" />
      </Helmet>
    );
  }

  render () {
    const { classes } = this.props;
    const {
      currentMemeId,
      voterCount,
      myVoteCount,
      loading,
      posterLinkBalance,
      posterYFLBalance,
      posterYFLStakedBalance,
      now,
    } = this.state;
    const account = store.getStore('account')

    if (!(account && account.address)) {
      return <Redirect to={`/details/${this.getMemeId()}/unlock`} />
    }

    if (loading) {
      return (
        <div className={ classes.root }>
          <Spinner />
        </div>
      );
    }

    return (
      <>
        {this.renderHelmet()}
        <Slider {...SLIDER_SETTINGS} ref={slider => this.slider = slider } afterChange={this.handleSlidedToIndex}>
          {this.getMemesToShow().map((meme, key) => (
            <div>
              <MemeDetail
                key={key}
                {...meme}
                onVote={this.handleVote}
                voterCount={(meme.id === currentMemeId) && voterCount}
                myVoteCount={getRoundedWei(myVoteCount)}
                posterLinkBalance={getRoundedWei(posterLinkBalance)}
                posterYFLBalance={getRoundedWei(posterYFLBalance)}
                posterYFLStakedBalance={getRoundedWei(posterYFLStakedBalance)}
              />
            </div>
          ))}
        </Slider>
      </>
    );
  }
}

export default withStyles(styles)(Details);
