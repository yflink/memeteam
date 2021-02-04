import React from 'react'
import { Link } from 'react-router-dom'

import './styles.css'

function Footer() {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-social">
          <a className="github" href="https://twitter.com/yflinkio" target="_blank" />
          <a className="twitter" href="https://twitter.com/yflinkio" target="_blank" />
          <a className="telegram" href="https://t.me/YFLinkGroup" target="_blank" />
          <a className="medium" href="https://blog.yflink.io/" target="_blank" />
          <a className="discord" href="https://discord.gg/dM6MJWm" target="_blank" />
        </div>
        <div className="footer-copyright">© 2020, YFLink Team01</div>
      </div>
    </div>
  )
}

export default Footer
