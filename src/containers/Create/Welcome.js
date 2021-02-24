import React, { PureComponent } from 'react'
import Spinner from '../../components/Spinner'
import './styles.css'
import Button from '@material-ui/core/Button'

class Welcome extends PureComponent {
  state = {}

  render() {
    const { loading } = true

    return (
      <section className="guidance">
        <div className="guidance-container">
          {loading ? (
            <div className="guidance-body-spinner">
              <Spinner />
            </div>
          ) : (
            <div className="guidance-wrapper">
              <div className="guidance-title">JOIN the team, marine!</div>
              <div className="guidance-copy">
                Let's set everything up so you can start voting for memes or sharing your own artpieces on memeteam.link
              </div>
              <div className="guidance-buttons">
                <Button className="button-main" href="/#/create/stake">
                  Let's go!
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }
}

export default Welcome
