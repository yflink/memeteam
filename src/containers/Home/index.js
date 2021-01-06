import React, { useState } from "react";
import Grid from '@material-ui/core/Grid';

import Menu from '../../components/Menu';
import Banner from '../../components/Banner'
import Footer from '../../components/Footer'
import { ContentSection } from '../../components/Sections'
import './styles.css';
import { SORTS, TIME_FILTERS, MEME_FILTERS, CAMPAIGN_FILTERS } from '../../Utils/filters';

function Home() {
  const [isFooterVisible ] = useState(true);
  const [isFixedMenu ] = useState(false);
  const [sort, setSort] = useState(SORTS[0].id);
  const [timeFilter, setTimeFilter] = useState(TIME_FILTERS[0].id);
  const [memeFilter, setMemeFilter] = useState(MEME_FILTERS[MEME_FILTERS.length - 1].id);
  const [campaignFilter, setCampaignFilter] = useState(CAMPAIGN_FILTERS[0].id);
  const filters = { sort, timeFilter, memeFilter, campaignFilter };
  const changeHandlers = { setSort, setTimeFilter, setMemeFilter, setCampaignFilter };

  return (
    <Grid container className="scroll-body">
      <Banner />
      <Menu isFixed={isFixedMenu} filters={filters} changeHandlers={changeHandlers} />
      <ContentSection filters={filters} />
      <Footer isVisible={isFooterVisible} />
    </Grid>
  );
}

export default Home;
