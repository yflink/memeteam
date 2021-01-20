import React, { PureComponent } from "react";
import Grid from '@material-ui/core/Grid';
import { Route,  Switch,  Redirect } from "react-router-dom";

import { ContentSection } from '../components/Sections'

import BackButton from "../components/BackButton";
import Approve from "./Approve";
import Buy from "./Buy";
import Register from "./Register";
import Unlock from "./Unlock";
import Stake from "./Stake";
import AllSet from "./AllSet";
import Create from "./Create";
import Title from "./Title";
import Tweet from "./Tweet";

const WrapperForCreate = (Component) => (props) => <Component isForCreate {...props} />
const UnlockWrapperForCreate = (Component) => (props) => <Component isForCreate redirectUrl="/create/buy" {...props} />

class CreateContainer extends PureComponent {
  render () {
    return (
      <Grid container className="f-w detail-container">
        <BackButton shouldGoHome />
        <Grid className="f-w b-white detail-content" container direction='column' alignItems='center' justify='center'>
          <Grid className="detail-box border-black" item>
            <Switch>
              <Route path="/create" component={Create} exact />
              <Route path="/create/unlock" component={UnlockWrapperForCreate(Unlock)} />
              <Route path="/create/buy" component={WrapperForCreate(Buy)} />
              <Route path="/create/register" component={WrapperForCreate(Register)} />
              <Route path="/create/approve" component={WrapperForCreate(Approve)} />
              <Route path="/create/stake" component={WrapperForCreate(Stake)} />
              <Route path="/create/allset" component={WrapperForCreate(AllSet)} />
              <Route path="/create/title" component={Title} />
              <Route path="/create/tweet/:id" component={Tweet} />
              <Redirect to="/" />
            </Switch>
          </Grid>
        </Grid>
        {/* <ContentSection isOverlay /> */}
      </Grid>
    );
  }
}

export default CreateContainer;
