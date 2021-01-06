import React, { PureComponent } from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Route,  Switch,  Redirect } from "react-router-dom";

import Header from '../components/Header';

import { ContentSection } from '../components/Sections'

import BackButton from "../components/BackButton";
import Approve from "./Approve";
import Details from "./Details";
import Buy from "./Buy";
import Register from "./Register";
import Unlock from "./Unlock";
import Stake from "./Stake";
import AllSet from "./AllSet";
import Voted from "./Voted";

const UnlockWrapperForDetail = (Component) => (props) => {
  const { match } = props;
  const memeId = match && match.params.id;
  return <Component redirectUrl={`/details/${memeId}`} {...props} />;
}

const WrapperForDetail = (Component) => (props) => <Component isForDetail {...props} />

class DetailsContainer extends PureComponent {
  render () {
    return (
      <Grid container className="f-w detail-container">
        <BackButton shouldGoHome />
        <Grid className="f-w b-white detail-content" container direction='column' alignItems='center' justify='center'>
          <Grid className='detail-box' item>
            <Switch>
              <Route path="/details/:id" component={Details} exact />
              <Route path="/details/:id/unlock" component={UnlockWrapperForDetail(Unlock)} />
              <Route path="/details/:id/buy" component={Buy} />
              <Route path="/details/:id/register" component={Register} />
              <Route path="/details/:id/approve" component={Approve} />
              <Route path="/details/:id/stake" component={WrapperForDetail(Stake)} />
              <Route path="/details/:id/allset" component={WrapperForDetail(AllSet)} />
              <Route path="/details/:id/voted" component={Voted} />
              <Redirect to="/" />
            </Switch>
          </Grid>
        </Grid>
        <ContentSection isFromDetail isOverlay />
      </Grid>
    );
  }
}

export default DetailsContainer;
