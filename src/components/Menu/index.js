import React, { PureComponent } from 'react'
import NativeSelect from '@material-ui/core/NativeSelect'

import './styles.css'
import { SORTS, MEME_FILTERS } from '../../Utils/filters'

class Menu extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { filters, changeHandlers, memes } = this.props

    const { sort, memeFilter } = filters
    const { setSort, setMemeFilter } = changeHandlers

    const handleSortChange = (event) => {
      setSort(event.target.value)
    }

    const handleMemeFilterChange = (event) => {
      setMemeFilter(event.target.value)
    }

    return (
      <div className="menu">
        <div className="meme-meta">
          <p className="meme-count">{memes.length} Memes</p>
        </div>
        <div className="menu-content">
          <NativeSelect value={memeFilter} onChange={handleMemeFilterChange} className="select" variant="outlined">
            {MEME_FILTERS.map(({ id, label }) => (
              <option value={id}>{label}</option>
            ))}
          </NativeSelect>
          <NativeSelect value={sort} onChange={handleSortChange} className="select" variant="outlined">
            {SORTS.map(({ id, label }) => (
              <option value={id}>{label}</option>
            ))}
          </NativeSelect>
        </div>
      </div>
    )
  }
}

export default Menu
