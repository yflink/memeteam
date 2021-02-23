import React from 'react'
import './styles.css'
import { Heart, Twitter } from 'react-feather'

export default function CardAdvancedRatingBar({ score, shares }) {
  return (
    <div className="advanced-rating-container">
      <div className="element">
        <div className="icon">
          <Heart />
        </div>
        <p>Score: {typeof score === 'undefined' || score === null ? 0 : parseFloat(score).toFixed(0)}</p>
      </div>
      <div className="element">
        <div className="icon">
          <Twitter />
        </div>
        <p>{typeof shares === 'undefined' || shares === null ? 0 : shares} Shares</p>
      </div>
    </div>
  )
}
