import React from 'react'
import TimerIcon from '@material-ui/icons/AccessTime'

import { formatCountdown } from '../../Utils'

import './styles.css'

export default function Index({ elapsed }) {
  return (
    <div className="time-bar-container">
      <div className={elapsed < 0 ? 'time-bar elapsed-closed' : 'time-bar elapsed-open'}>
        <div className="counter-icon">
          <TimerIcon />
        </div>
        <p className="counter">{formatCountdown(elapsed)}</p>
      </div>
    </div>
  )
}
