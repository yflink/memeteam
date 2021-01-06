import React from 'react';

import './styles.css';

function Footer({isVisible}) {
  return (
    <div className={`footer ${isVisible? '':'hide'}`} >
      <a className="footer-social" href="https://yflink.io" target="_blank">YFLINK Home</a>
      <a className="footer-social" href="https://discord.gg/dM6MJWm" target="_blank">Discord</a>
      <a className="footer-social" href="https://twitter.com/yflinkio" target="_blank">Twitter</a>
      <a className="footer-social" href="https://t.me/YFLinkGroup" target="_blank">Telegram</a>
      <a className="footer-social" href="https://blog.yflink.io/" target="_blank">Blog</a>
    </div>
  )
}

export default Footer;
