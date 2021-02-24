import React, { useEffect, useCallback, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import qs from 'query-string'
import ipfsClient from 'ipfs-http-client'

import Store from '../stores'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import Button from '@material-ui/core/Button'
import { Image } from 'react-feather'

const store = Store.store

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
      history.push('/create/welcome')
    } else if (account && account.address) {
      history.push('/create/buy')
    } else {
      history.push('/create/unlock')
    }
  }, [history, isFromStake])

  const uploadImage = useCallback(
    async (image) => {
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
    },
    [history]
  )

  const onDrop = useCallback(
    (files) => {
      uploadImage(files[0])
    },
    [uploadImage]
  )

  const handleFileUpload = useCallback(
    async (event) => {
      uploadImage(event.target.files[0])
    },
    [uploadImage]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const inputEl = useRef(null)
  return (
    <section className="guidance">
      <div className="guidance-container">
        <BackButton />
        <div className="guidance-wrapper">
          <div className="guidance-title">Meme Upload</div>
          <div className="guidance-copy">
            Glad to see you participating, Marine! Pick your artpiece and share it with the community:
          </div>
          <div {...getRootProps()} className="guidance-upload">
            <input {...getInputProps()} />
            {uploading ? (
              <div className="guidance-body-spinner">
                <Spinner />
              </div>
            ) : isDragActive ? (
              <div>Drop an image here!</div>
            ) : (
              <div>Drop an image here</div>
            )}
          </div>
          <div className="guidance-or">or</div>
          <div className="guidance-buttons">
            <input onChange={handleFileUpload} type="file" ref={inputEl} style={{ display: 'none' }} />
            <Button className="button-main upload" onClick={() => inputEl.current.click()}>
              <Image /> Upload
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Create
