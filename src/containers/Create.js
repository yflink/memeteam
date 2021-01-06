import React, { useEffect, useCallback, useState } from "react";
import {useDropzone} from 'react-dropzone'
import { withStyles } from '@material-ui/core/styles';
import qs from 'query-string';

import Store from "../stores";
import config from "../config";
import Spinner from "../components/Spinner";
const store = Store.store

export const SLIDER_SETTINGS = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

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
    cursor: 'pointer'
  },
});

function Create({ location, history, classes }) {
  const [uploading, setUploading] = useState(false);
  let params = qs.parse(location.search);
  const { isFromStake } = params || {};
  console.log({ isFromStake });

  useEffect(() => {
    const account = store.getStore('account');
    if (isFromStake || store.stakedEnoughYFL()) {
      return;
    }

    if (store.hasEnoughYFL()) {
      history.push('/create/stake');
    } else if (account && account.address) {
      history.push('/create/buy');
    } else {
      history.push('/create/unlock');
    }
  }, [])

  const uploadImage = useCallback((image) => {
    setUploading(true);
    const req = new XMLHttpRequest()
    const data = new FormData()

    data.append('image', image)

    req.open('POST', 'https://api.imgur.com/3/image/')
    req.setRequestHeader('Authorization', `Client-ID ${config.imgur.client}`)
    req.onerror = () => {
      setUploading(false);
    }
    req.onreadystatechange = () => {
      if(req.status === 200 && req.readyState === 4) {
        setUploading(false);
        let res = JSON.parse(req.responseText)
        store.setStore({ creatingMemeLink: `https://i.imgur.com/${res.data.id}.png` });
        history.push('/create/title');
      }
    }
    req.send(data)
  }, [])
  
  const onDrop = useCallback((files) => {
    uploadImage(files[0])
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop })

  return (
    <div className={classes.container}>
      <div {...getRootProps()} className={classes.zone}>
        <input {...getInputProps()} />
        {uploading ? (
          <Spinner />
        ) : isDragActive ? (
          <div>Drop an image here...</div>
        ) : (
          <div>Drop an image here, <br></br>or click to upload from your computer</div>
        )}
      </div>
    </div>
  )
}

export default withStyles(styles)(Create);
