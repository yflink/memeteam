import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Route, Switch, Redirect } from 'react-router-dom'

import { ContentSection } from '../components/Sections'

import BackButton from '../components/BackButton'
import Approve from './Create/Approve'
import Details from './Details'
import Buy from './Create/Buy'
import Welcome from './Create/Welcome'
import Unlock from './Create/Unlock'
import Stake from './Create/Stake'
import AllSet from './Create/AllSet'
import Voted from './Voted'

const UnlockWrapperForDetail = (Component) => (props) => {
  const { match } = props
  const memeId = match && match.params.id
  return <Component redirectUrl={`/details/${memeId}`} {...props} />
}

const WrapperForDetail = (Component) => (props) => <Component isForDetail {...props} />

const UnlockDetailsWithMemeStatusCB = (Component, onMemeStatusChanged) => (props) => {
  return <Component {...props} onMemeStatusChanged={onMemeStatusChanged} />
}

const DetailsContainer = () => {
  return (
    <Grid container className="f-w detail-container">
      <BackButton shouldGoHome />
      <Switch>
        <Route path="/details/:id" component={UnlockDetailsWithMemeStatusCB(Details)} exact />
        <Route path="/details/:id/unlock" component={UnlockWrapperForDetail(Unlock)} />
        <Route path="/details/:id/buy" component={Buy} />
        <Route path="/details/:id/welcome" component={Welcome} />
        <Route path="/details/:id/approve" component={Approve} />
        <Route path="/details/:id/stake" component={WrapperForDetail(Stake)} />
        <Route path="/details/:id/allset" component={WrapperForDetail(AllSet)} />
        <Route path="/details/:id/voted" component={Voted} />
        <Redirect to="/" />
      </Switch>
      <ContentSection isFromDetail isOverlay />
    </Grid>
  )
}

export default DetailsContainer
