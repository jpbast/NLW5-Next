import React, { useContext, useEffect } from 'react'
import { PlayContext } from '../../contexts/PlayContext'
import PlayerController from '../PlayerController'
import styles from './styles.module.scss'
import Image from 'next/image'

export default function index() {
  const { playlist, playlistIndex } = useContext(PlayContext)
  const play = playlist[0]
  const index = playlistIndex[0]

  const episode = play[index]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Playing"/>
        <h3>Tocando agora</h3>
      </header>

      <div className={styles.podcastInfo}>
        <div className={styles.selectPodcast}>   
          { !episode ? <strong>Selecione um podcast para ouvir</strong> : null}
          { episode ? <Image width={888} height={1038} objectFit="cover" src={episode.thumbnail} alt="Thumbnail"/> : null}  
                 
        </div>
        { episode && (
            <p>
              <span>{episode.title}</span>
              <span>{episode.members}</span>
            </p>
        )} 
      </div>

      <footer>
        <PlayerController />
      </footer>
    </div>
  )
}
