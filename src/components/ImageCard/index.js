import React, { PureComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import CardTimeRatingBar from '../CardTimeRatingBar'
import { getRoundedWei } from '../../web3/utils';
import { NOW_TIMESTAMP_UPDATED } from '../../web3/constants';
import Store from "../../stores";
import Meme from "../Meme";

import './styles.css';

export const logo = require('../../assets/images/YFLink_blue_round.svg');

const emitter = Store.emitter
const store = Store.store

class ImageCard extends PureComponent {
  state = {}

  componentDidMount() {
    emitter.on(NOW_TIMESTAMP_UPDATED, this.updateNow);
  }

  componentWillUnmount() {
    emitter.removeListener(NOW_TIMESTAMP_UPDATED, this.updateNow);
  };

  updateNow = () => {
    let now = store.getStore('now');
    this.setState({ now });
  }

  render () {
    const {
      id,
      link,
      title,
      totalForVotes,
      end,
      isForBrowseMore,
      leaderboardItem,
    } = this.props;
    const { now } = this.state;

    if (isForBrowseMore) {
      return (
        <Grid container className={classnames('card')} id={id}>
          <div>
            <Link to="/" replace><img className="img card-logo" src={logo} alt='meme' /></Link>
          </div>
          <p className="card-title card-logo-title">Browse More Memes</p>
        </Grid>
      )
    }

    return (
      <Grid container className={classnames('card', { 'card-open': end > now })} id={id}>
        <div>
          <Link to={`/details/${id}`} replace>
          <Meme link={link} memeClass='img card-image'/>
          </Link>
        </div>
        <Grid className="card-detail" container direction='column'>
          <Grid container direction='row'>
            <p className="card-id" >#{id}</p>
            <p className="card-title" >{title}</p>
          </Grid>
          <CardTimeRatingBar
            elapsed={end - now}
            rating={leaderboardItem?.score?.toFixed(2) || '--'}
          />
        </Grid>
      </Grid>
    );
  }
}

export default ImageCard;
