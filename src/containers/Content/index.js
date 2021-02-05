import React, { useState } from 'react'
import Menu from '../../components/Menu'
import { ContentSection } from '../../components/Sections'
import { SORTS, MEME_FILTERS } from '../../Utils/filters'
import Unlock from '../Unlock'
import Store from '../../stores'

export default function Content() {
  const [filteredMemes, setFilteredMemes] = useState([])
  const [sort, setSort] = useState(SORTS[0].id)
  const [memeFilter, setMemeFilter] = useState(MEME_FILTERS[MEME_FILTERS.length - 1].id)
  const filters = { sort, memeFilter }
  const changeHandlers = { setSort, setMemeFilter }

  const memeUpdate = function (memes) {
    if (connected && memes.length !== filteredMemes.length) {
      setFilteredMemes(memes)
    }
  }

  const store = Store.store
  const account = store.getStore('account')
  const connected = account && account.address

  return (
    <>
      {connected ? (
        <>
          <Menu memes={filteredMemes} filters={filters} changeHandlers={changeHandlers} />
          <ContentSection filters={filters} updateMemes={memeUpdate} />
        </>
      ) : (
        <div style={{ width: '100%', padding: '58px 0 90px', display: 'flex', justifyContent: 'center' }}>
          <Unlock redirectUrl="/" title="Connect to Metamask to continue" type="main" />
        </div>
      )}
    </>
  )
}
