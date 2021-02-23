import React, { useEffect, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { withStyles } from '@material-ui/core/styles'
import qs from 'query-string'
import ipfsClient from 'ipfs-http-client'

import Store from '../stores'
import Spinner from '../components/Spinner'

const store = Store.store

export const SLIDER_SETTINGS = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
}

const styles = () => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zone: {
    height: '60%',
    width: '60%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px dashed black',
    fontSize: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
})

function Create({ location, history, classes }) {
  const [uploading, setUploading] = useState(false)
  let params = qs.parse(location.search)
  const { isFromStake } = params || {}

  useEffect(() => {
    const account = store.getStore('account')
    if (isFromStake || store.stakedEnoughYFL()) {
      return
    }

    if (store.hasEnoughYFL()) {
      history.push('/create/stake')
    } else if (account && account.address) {
      history.push('/create/buy')
    } else {
      history.push('/create/unlock')
    }
  }, [])

  const uploadImage = useCallback(async (image) => {
    setUploading(true)
    const ipfs = ipfsClient('https://ipfs.infura.io:5001')

    const fileDetails = {
      path: image.name,
      content: image,
    }
    const options = {
      wrapWithDirectory: true,
      progress: (prog) => console.log(`received: ${prog}`),
    }

    try {
      const res = await ipfs.add(fileDetails, options)
      setUploading(false)
      const memeLink = `https://ipfs.io/ipfs/${res.cid.toString()}/${image.name}`
      store.setStore({ creatingMemeLink: memeLink })
      history.push('/create/title')
    } catch (err) {
      setUploading(false)
      console.log(err)
    }
  }, [])

  const onDrop = useCallback((files) => {
    uploadImage(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className={classes.container}>
      <div {...getRootProps()} className={classes.zone}>
        <input {...getInputProps()} />
        {uploading ? (
          <Spinner />
        ) : isDragActive ? (
          <div>Drop an image here...</div>
        ) : (
          <div>
            Drop an image here, <br></br>or click to upload from your computer
          </div>
        )}
      </div>
    </div>
  )
}

export default withStyles(styles)(Create)
