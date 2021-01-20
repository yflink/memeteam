import React from 'react';
import TimerIcon from '@material-ui/icons/AccessTime';

import { formatCountdown } from '../../Utils';

import './styles.css';

export default function CardTimeRatingBar({ elapsed, rating }) {
  return (
    <div className="elapsed-bar f-w flex justify-space-between"  >
      <div className={elapsed < 0 ? 'elapsed-closed' : 'elapsed-open f-green'}>
        <div alt='elapsed' >
          <TimerIcon />
        </div>
        {formatCountdown(elapsed)}
      </div>
      <div className="flex">
        <div className="thumb-icon" alt='thumb' >
          ☑️
        </div>
        {rating}   
      </div>
    </div>
  )
}
