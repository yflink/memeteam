import React, { useCallback, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Link } from 'react-router-dom';

import { campaignConfig } from '../../campaign.config';
import Store from "../../stores";
import {
  bannerImg1,
  bannerImg2,
  logo
} from '../../assets';
import { NOW_TIMESTAMP_UPDATED } from "../../web3/constants";
import { formatCountdown } from "../../Utils";
import './styles.css';
import StartBlockLink from '../StartBlockLink';

const store = Store.store
const emitter = Store.emitter

const images = [
  bannerImg1,
  bannerImg2,
  logo
];

function Banner({ }) {
  const [now, setNow] = useState();

  useEffect(() => {
    emitter.on(NOW_TIMESTAMP_UPDATED, updateNow);
    return () => {
      emitter.removeListener(NOW_TIMESTAMP_UPDATED, updateNow);
    }
  }, [])

  const updateNow = useCallback(() => {
    setNow(store.getStore('now'));
  })

  const { currentCampaignEndBlock, currentCampaignStartBlock } = campaignConfig;

  return (
    <Grid container className="section hero-section justify-center">
      <p
        className="heading f-lg f-w flex justify-center"
        dangerouslySetInnerHTML={{
          __html: 'Win $YFL when you upload and/or vote for memes.&nbsp<a target="_blank" href="https://blog.yflink.io/draft-brief-operation-dry-run/">Competition Rules</a>',
        }}
      />
      <Grid container className="hero-section-container f-w b-white" direction='row'>
        <Grid container item xs={3} justify='space-evenly' alignItems='center' direction="column">
          {!now ? (
            null
          ) : currentCampaignStartBlock > now ? (
            <>
              <Typography
                variant="h6"
                dangerouslySetInnerHTML={{ __html: "<b>Operation "+campaignConfig.currentCampaign+"<br> Starts at Block: </b>" }}
              />
              <Typography className="f-green"
                variant="h5"
              >
                <StartBlockLink startBlock={currentCampaignStartBlock} onclick="window.open(this.href,'_blank');return false;" href="https://etherscan.io/block/countdown/{currentCampaignStartBlock}" />
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                dangerouslySetInnerHTML={{ __html: "<b>Operation "+campaignConfig.currentCampaign+" <br>Ends In:</b>" }}
              />
              <Typography className="f-green"
                variant="h5"
                dangerouslySetInnerHTML={{ __html: "<b>"+formatCountdown(currentCampaignEndBlock - now).toUpperCase()+"</b>" }}
              />
            </>
          )}
        </Grid>
        <Grid container item xs={6} direction='column' justify='center' alignItems='center'>
          <Typography
            variant="h6"
            dangerouslySetInnerHTML={{ __html: `<b>Welcome to The Meme Team</b>` }}
          />
          <Link to="/create">
            <Button
              className="header-button b-white"
              variant="outlined"
              startIcon={<AddBoxIcon />}
            >
              upload meme
            </Button>
           </Link>
        </Grid>
        <Grid container className='img-container' item xs={3} direction='column' justify='center' alignItems='center'>
          {images.map((image, index)=>
            <img className={`img-main img${index}`} src={image} alt=""/>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Banner;
