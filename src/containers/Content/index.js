import React, { useState } from 'react'
import Menu from '../../components/Menu'
import { ContentSection } from '../../components/Sections'
import { SORTS, MEME_FILTERS } from '../../Utils/filters'
function Home() {
  const [filteredMemes, setFilteredMemes] = useState([])
  const [sort, setSort] = useState(SORTS[0].id)
  const [memeFilter, setMemeFilter] = useState(MEME_FILTERS[MEME_FILTERS.length - 1].id)
  const filters = { sort, memeFilter }
  const changeHandlers = { setSort, setMemeFilter }

  const memeUpdate = function (memes) {
    if (memes.length !== filteredMemes.length) {
      setFilteredMemes(memes)
    }
  }

  return (
    <>
      <Menu memes={filteredMemes} filters={filters} changeHandlers={changeHandlers} />
      <ContentSection filters={filters} updateMemes={memeUpdate} />
    </>
  )
}

export default Home
