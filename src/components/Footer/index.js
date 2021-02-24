import React from 'react'

import './styles.css'

function Footer() {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-social">
          <a className="github" href="https://twitter.com/yflinkio" rel="noopener noreferrer" target="_blank">
            Github
          </a>
          <a className="twitter" href="https://twitter.com/yflinkio" rel="noopener noreferrer" target="_blank">
            Twitter
          </a>
          <a className="telegram" href="https://t.me/YFLinkGroup" rel="noopener noreferrer" target="_blank">
            Telegram
          </a>
          <a className="medium" href="https://blog.yflink.io/" rel="noopener noreferrer" target="_blank">
            Medium
          </a>
          <a className="discord" href="https://discord.gg/dM6MJWm" rel="noopener noreferrer" target="_blank">
            Discord
          </a>
        </div>
        <div className="footer-copyright">© 2020, YFLink Team01</div>
      </div>
    </div>
  )
}

export default Footer
