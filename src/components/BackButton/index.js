import React from "react";
import { Link, withRouter } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';

import './styles.css';

function BackButton({ history, shouldGoHome }) {
  const handleGoBack = () => {
    if (shouldGoHome) {
      history.replace('/');
    } else {
      history.goBack();
    }
  };

  return (
    <Button className='arrow-back' onClick={handleGoBack}>
      <ArrowBackIcon/>
    </Button>
  );
}

export default withRouter(BackButton);
