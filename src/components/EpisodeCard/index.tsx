import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './styles.module.scss'
import { formatDuration } from '../../utils/formatDuration'
import PlayGreen from '../PlayGreen'

export default function EpisodeCard({ episodes, episode, index }) {
  return (
    <div className={styles.card}>
      <Image width={192} height={192} objectFit="cover" className={styles.thumbnail} src={episode.thumbnail} alt="Thumbail"/>
      <div>
        <Link href={`/episodes/${episode.id}`}>
          <a>{episode.title}</a>
        </Link>
        <div>
          <div>
            <span>{episode.members}</span>
            <div>
              <span>{episode.published_at}</span>
              <span className={styles.dot}></span>
              <span>{formatDuration(episode.file.duration)}</span>
            </div>
          </div>
          <PlayGreen episodes={episodes} index={index} style={{width: '2.5rem', height: '2.5rem'}} />
        </div>
      </div>
    </div>
  )
}
