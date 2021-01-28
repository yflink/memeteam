import React, { PureComponent } from "react";

class Meme extends PureComponent {

  render() {
    const { memeClass, link } = this.props;

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

    return (
        <div>
            {isVideo ? (
                <video className={memeClass} width="320" height="150" controls>
                        <source src={link} type={extension}/>
                </video>
            ) : (
                <img className={memeClass} src={link} alt='Meme' />
            )}
        </div>
      
    )
  };
}

export default Meme;
