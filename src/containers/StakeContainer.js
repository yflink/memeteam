import React, { PureComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import { Route, Switch, Redirect } from 'react-router-dom'

import BackButton from '../components/BackButton'
import Stake from './Stake'
import AllSet from './AllSet'

class StakeContainer extends PureComponent {
  render() {
    return (
      <Grid container className="f-w detail-container">
        <BackButton shouldGoHome />
        <Switch>
          <Route path="/stake" component={Stake} exact />
          <Route path="/stake/allset" component={AllSet} />
          <Redirect to="/" />
        </Switch>
      </Grid>
    )
  }
}

export default StakeContainer
