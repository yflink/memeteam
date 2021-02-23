import React from 'react'
import './styles.css'
import { Heart, User, Twitter } from 'react-feather'

export default function CardAdvancedRatingBar({ score, voters, shares }) {
  return (
    <div className="advanced-rating-container">
      <div className="element">
        <div className="icon">
          <Heart />
        </div>
        <p>Score: {typeof score === 'undefined' || score === null ? 0 : score.toFixed(0)}</p>
      </div>
      <div className="element">
        <div className="icon">
          <User />
        </div>
        <p>{typeof voters === 'undefined' || voters === null ? 0 : voters.toFixed(0)} Voters</p>
      </div>
      <div className="element">
        <div className="icon">
          <Twitter />
        </div>
        <p>{typeof shares === 'undefined' || shares === null ? 0 : shares.toFixed(0)} Shares</p>
      </div>
    </div>
  )
}
