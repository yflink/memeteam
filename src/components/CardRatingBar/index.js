import React from 'react'
import './styles.css'
import { abbreviateAddress } from '../../web3/utils'
import { Heart } from 'react-feather'

export default function CardRatingBar({ rating, proposer }) {
  const proposerShorthand = proposer ? abbreviateAddress(proposer) : 'Unknown'
  const parsedRating = Number(rating)
  return (
    <div className="rating-container">
      <div className="posted">
        <p>Posted by</p>
        <a href={`https://etherscan.io/address/${proposer}`} rel="noopener noreferrer" target="_blank">
          {proposerShorthand.toUpperCase()}
        </a>
      </div>
      <div className="rating">
        <div className="rate-icon">
          <Heart />
        </div>
        <p>{typeof rating === 'undefined' || rating === null ? 0 : parsedRating.toFixed(0)}</p>
      </div>
    </div>
  )
}
