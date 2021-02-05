import React from 'react'
import Hero from '../../components/Hero'
import Content from '../Content'
import './styles.css'

function Home() {
  return (
    <>
      <Hero
        intro="Your Battleground"
        headline="Operation Dry Run"
        subline="Link marines, it’s time to bring the best community in crypto together in the biggest meme competition since Portnoys glorious exit. In this first MEME TEAM campaign you can vote for your favourite meme or even upload one yourself. Wen moon? Now!"
      />
      <Content />
    </>
  )
}

export default Home
