import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';

import './styles.css';
import { SORTS, TIME_FILTERS, MEME_FILTERS, CAMPAIGN_FILTERS } from '../../Utils/filters';

function Menu({ isFixed, changeHandlers, filters  }) {
  const { sort, timeFilter, memeFilter, campaignFilter } = filters;
  const { setSort, setTimeFilter, setMemeFilter, setCampaignFilter } = changeHandlers;

  const handleSortChange = (event) => {
    setSort(event.target.value)
  };

  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value)
  };

  const handleMemeFilterChange = (event) => {
    setMemeFilter(event.target.value)
  };

  const handleCampaignFilterChange = (event) => {
    setCampaignFilter(event.target.value)
  };

  return (
    <div className={`menu ${isFixed? 'fixed': ''}`}>
      <div syle={{ flex: 1 }}/>
      <div className="menu-content">
        <NativeSelect
          value={memeFilter}
          onChange={handleMemeFilterChange}
          className='select'
          variant="outlined"
        >
          {MEME_FILTERS.map(({ id, label })=>
            <option value={id}>{label}</option>
          )}
        </NativeSelect>
        <NativeSelect
          value={campaignFilter}
          onChange={handleCampaignFilterChange}
          name="campaign"
          className='select'
          variant="outlined"
        >
          {CAMPAIGN_FILTERS.map(({ id, label })=>
            <option value={id}>{label}</option>
          )}
        </NativeSelect>
        <NativeSelect
          value={timeFilter}
          onChange={handleTimeFilterChange}
          className='select'
          variant="outlined"
        >
          {TIME_FILTERS.map(({ id, label })=>
            <option value={id}>{label}</option>
          )}
        </NativeSelect>
        <NativeSelect
          value={sort}
          onChange={handleSortChange}
          className='select'
          variant="outlined"
        >
          {SORTS.map(({ id, label })=>
            <option value={id}>{label}</option>
          )}
        </NativeSelect>
      </div>
    </div>
  )
}

export default Menu;
