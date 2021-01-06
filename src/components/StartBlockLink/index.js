import React from 'react';

const StartBlockLink = ({ startBlock }) => {
  return (
    <a href={`https://etherscan.io/block/countdown/${startBlock}`} target="_blank">{startBlock}</a>
  )
}

export default StartBlockLink;
