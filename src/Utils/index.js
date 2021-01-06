import * as moment from 'moment';

const IMGUR_PREFIX = 'https://i.imgur.com/';

export const formatCountdown = (countdown) => {
  if (!countdown) {
    return '';
  }

  const milliseconds = countdown * 13.8 *1000;
  if (countdown <= 0) {
    return 'Voting Closed';
  }

  const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
  const hhmmss = moment.utc(milliseconds).format('H')+'h,'+moment.utc(milliseconds).format('mm')+'m,'+moment.utc(milliseconds).format('ss')+'s';
  if (days > 0) {
    return `${days}d ${hhmmss}`;
  } else {
    return hhmmss;
  }
}

//for use in tweet text
export const getRootDomain = (includeProtocal) => {
  const { location } = window;
  return includeProtocal ? location.protocol + '//' + location.host : location.host;
};

export const openTweet = (memeId, title, image) => {
  const cleanTitle = title == null || title == 'null' ? 'No Title' : title;
  const url = `https://vote.memeteam.link/?memeId=${memeId}&title=${escape(cleanTitle)}&image=${image}`;
  const text = `Vote for meme #${memeId} in the $YFL Meme Team Competition (prizes for voters & uploaders)☑️🚀💪 #crypto #itsover`;
  window.open(
    'http://twitter.com/share?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text),
    '',
    'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0'
  );
}

export const getFileFromImgurLink = (link) => link.slice(IMGUR_PREFIX.length);
export const getImgurLinkFromFile = (fileName) => IMGUR_PREFIX + fileName;
