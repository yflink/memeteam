import React, { PureComponent } from 'react'
import Menu from '../../components/Menu'
import { ContentSection } from '../../components/Sections'
import { SORTS, MEME_FILTERS } from '../../Utils/filters'
import Unlock from '../Unlock'
import Store from '../../stores'
const store = Store.store

class Content extends PureComponent {
  state = {
    connected: false,
    memeFilter: MEME_FILTERS[MEME_FILTERS.length - 1].id,
    sortFilter: SORTS[0].id,
    filteredMemes: [],
  }

  componentDidMount() {
    const _that = this
    setTimeout(function () {
      _that.checkForConnection()
    }, 500)
  }

  componentDidUpdate() {
    const _that = this
    setTimeout(function () {
      _that.checkForConnection()
    }, 1000)
  }

  checkForConnection = () => {
    const account = store.getStore('account')
    const connected = account && account.address
    if (this.state.connected !== connected) {
      this.setState({ connected: connected })
    }
  }

  memeUpdate = (memes) => {
    const { connected, filteredMemes } = this.state
    if (connected && memes.length !== filteredMemes.length) {
      this.setState({ filteredMemes: memes })
    }
  }

  setMeme = (memeFilter) => {
    this.setState({ memeFilter: memeFilter })
  }

  setSort = (sortFilter) => {
    this.setState({ sortFilter: sortFilter })
  }

  render() {
    const { filteredMemes, connected, memeFilter, sortFilter } = this.state
    const filters = { sortFilter, memeFilter }
    const setSortFilter = this.setSort
    const setMemeFilter = this.setMeme
    const changeHandlers = { setSortFilter, setMemeFilter }

    return (
      <>
        {connected ? (
          <>
            <Menu memes={filteredMemes} filters={filters} changeHandlers={changeHandlers} />
            <ContentSection filters={filters} updateMemes={this.memeUpdate} />
          </>
        ) : (
          <div style={{ width: '100%', padding: '58px 0 90px', display: 'flex', justifyContent: 'center' }}>
            <Unlock redirectUrl="/" title="Connect to Metamask to continue" type="main" />
          </div>
        )}
      </>
    )
  }
}

export default Content
