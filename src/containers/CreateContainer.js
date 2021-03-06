import React, { PureComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import { Route, Switch, Redirect } from 'react-router-dom'

import BackButton from '../components/BackButton'
import Approve from './Create/Approve'
import Buy from './Create/Buy'
import Stake from './Create/Stake'
import Staking from './Create/Staking'
import Welcome from './Create/Welcome'
import AllSet from './Create/AllSet'
import Create from './Create/Create'
import Title from './Create/Title'
import Tweet from './Create/Tweet'

const WrapperForCreate = (Component) => (props) => <Component isForCreate {...props} />

class CreateContainer extends PureComponent {
  render() {
    return (
      <Grid container className="f-w detail-container">
        <BackButton shouldGoHome />
        <Switch>
          <Route path="/create" component={Create} exact />
          <Route path="/create/buy" component={WrapperForCreate(Buy)} />
          <Route path="/create/approve" component={WrapperForCreate(Approve)} />
          <Route path="/create/stake" component={WrapperForCreate(Stake)} />
          <Route path="/create/staking" component={WrapperForCreate(Staking)} />
          <Route path="/create/allset" component={WrapperForCreate(AllSet)} />
          <Route path="/create/welcome" component={WrapperForCreate(Welcome)} />
          <Route path="/create/title" component={Title} />
          <Route path="/create/tweet/:id" component={Tweet} />
          <Redirect to="/" />
        </Switch>
      </Grid>
    )
  }
}

export default CreateContainer
