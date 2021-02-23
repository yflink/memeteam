import React from 'react'
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { ChevronLeft } from 'react-feather'

function BackButton({ history, shouldGoHome }) {
  const handleGoBack = () => {
    if (shouldGoHome) {
      history.replace('/')
    } else {
      history.goBack()
    }
  }

  return (
    <Button className="button-back" onClick={handleGoBack}>
      <ChevronLeft /> Back to Campaign
    </Button>
  )
}

export default withRouter(BackButton)
