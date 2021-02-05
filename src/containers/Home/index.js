import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Hero from '../../components/Hero'
import Content from '../Content'
import './styles.css'

function Home() {
  return (
    <Grid container className="scroll-body">
      <Hero
        intro="Your Battleground"
        headline="Operation Dry Run"
        subline="Link marines, it’s time to bring the best community in crypto together in the biggest meme competition since Portnoys glorious exit. In this first MEME TEAM campaign you can vote for your favourite meme or even upload one yourself. Wen moon? Now!"
      />
      <Content />
    </Grid>
  )
}

export default Home
