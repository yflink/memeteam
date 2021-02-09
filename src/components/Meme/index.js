import React, { PureComponent } from "react";

class Meme extends PureComponent {
  render() {
    const { memeClass, link, noOverlay } = this.props;

    var extension;
    var isVideo = false;
    if(link) {
      const extensionStartIndex = link.lastIndexOf('.');
      extension = link.substring(extensionStartIndex + 1, link.length);
      extension = extension.toLowerCase();
      if (extension === 'mp4' || extension === 'mp3' || extension === 'ogg' || extension === 'webm') {
        isVideo = true;
        extension = 'video/' + extension;
      }
    }

    if (isVideo) {
      return (
        <video className={memeClass} width="320" height="150" controls>
          <source src={link} type={extension}/>
        </video>
      );
    }

    return (
      <>
        <img className={memeClass} src={link} alt='Meme' />
        {!noOverlay && (
          <div className="link-overlay"><a href={link} target="_blank">{link}</a></div>
        )}
      </>
    );
  };
}

export default Meme;
