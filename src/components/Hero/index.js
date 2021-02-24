import React, { PureComponent } from 'react'
import './styles.css'

class Hero extends PureComponent {
  render() {
    const { intro, headline, subline } = this.props
    return (
      <div className="hero">
        <p className="hero-intro">{intro}</p>
        <div className="hero-headline-wrapper">
          <h1 className="hero-headline">{headline}</h1>
        </div>
        <p className="hero-subline">{subline}</p>
      </div>
    )
  }
}

export default Hero
