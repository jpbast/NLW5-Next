import React, { useContext, useState } from 'react'
import { PlayContext } from '../../contexts/PlayContext'
import styles from './styles.module.scss'


export default function (props) {
  const {playlist, playlistIndex } = useContext(PlayContext)
  const [index, setIndex] = playlistIndex
  const [play, setPlay] = playlist

  function handleClick() {
    setIndex(props.index)
    setPlay(props.episodes)
  }

  return (
    <button onClick={handleClick} style={props.style} className={styles.button}>
      <img 
        style={props.style.width === '2.5rem' ? {width: '1.5625rem', height: '1.5625rem'} : {width: '1.25rem', height: '1.25rem'}} 
        src="/play-green.svg" alt="Play button"/>
    </button>
  )
}
