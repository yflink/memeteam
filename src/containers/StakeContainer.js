import React, { PureComponent } from "react";
import Grid from '@material-ui/core/Grid';
import { Route,  Switch,  Redirect } from "react-router-dom";

import { ContentSection } from '../components/Sections'

import BackButton from "../components/BackButton";
import Stake from "./Stake";
import AllSet from "./AllSet";

class StakeContainer extends PureComponent {
  render () {
    return (
      <Grid container className="f-w detail-container">
        <BackButton shouldGoHome />
        <Grid className="f-w b-white detail-content" container direction='column' alignItems='center' justify='center'>
          <Grid className="detail-box border-black" item>
            <Switch>
              <Route path="/stake" component={Stake} exact />
              <Route path="/stake/allset" component={AllSet} />
              <Redirect to="/" />
            </Switch>
          </Grid>
        </Grid>
        {/* <ContentSection isOverlay /> */}
      </Grid>
    );
  }
}

export default StakeContainer;
