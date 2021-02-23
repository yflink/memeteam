import React, { PureComponent } from 'react'
import ReactPlayer from 'react-player'

export default class Meme extends PureComponent {
  render() {
    const { memeClass, link, alt } = this.props
    const isVideo = ReactPlayer.canPlay(link)

    return (
      <>
        {isVideo ? (
          <div className={memeClass}>
            <ReactPlayer url={link} width="100%" controls={true} />
          </div>
        ) : (
          <img className={memeClass} src={link} alt={alt} />
        )}
      </>
    )
  }
}
