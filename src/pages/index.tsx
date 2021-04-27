import styles from './index.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import EpisodeCard from '../components/EpisodeCard'
import { formatDuration } from '../utils/formatDuration'
import PlayGreen from '../components/PlayGreen'
import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useContext } from 'react'
import { PlayContext } from '../contexts/PlayContext'

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  file: {
    url: string;
    type: string;
    duration: number;
    durationFormatted: string
  }
}

type HomeProps = {
  data: Array<Episode> //Episode[] é equivalente
}

export default function Home(props: HomeProps) {
  const { playlist } = useContext(PlayContext)
  const setPlay = playlist[1]

  // setPlay(props.data)

  return (
    <div className={styles.indexWrapper}>
      <section className={styles.lastReleases}>
        <h2>Últimos lançamentos</h2>
        <div className={styles.cardsContainer}>
          <EpisodeCard episodes={props.data} episode={props.data[0]} index={0} />
          <EpisodeCard episodes={props.data} episode={props.data[1]} index={1} />
        </div>
      </section>
      <section>
        <h2>Todos os episódios</h2>
        <header className={styles.episodes}>
          <span>PODCAST</span>
          <span>INTEGRANTES</span>
          <span>DATA</span>
          <span>DURAÇÃO</span>
        </header>
        <div className={styles.episodesContainer}>
          { props.data.map((episode, index) => {
              return (
                <div key={episode.id} className={styles.episodes}>
                  <div>
                    <div>
                      <Image width={120} height={120} objectFit="cover" src={episode.thumbnail} alt="Thumbnail"/>
                    </div>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </div>
                  <span>{episode.members}</span>
                  <span className={styles.date}>{episode.published_at}</span>
                  <span>{episode.file.durationFormatted}</span>
                  <PlayGreen episodes={props.data} index={index} style={{width: '2rem', height: '2rem'}} />
                </div>
              )
          }) }
        </div>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const episodes = await fetch('https://json-server-podcastr.herokuapp.com/episodes')
    .then(res => res.json())
    .then(data => data)
    .catch(err => err)

  const data = episodes.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR
      }),
      thumbnail: episode.thumbnail,
      file: {
        url: episode.file.url,
        type: episode.file.type,
        duration: episode.file.duration,
        durationFormatted: formatDuration(Number(episode.file.duration))
      }
    }
  })
  
  return {
    props: {
      data
    },
    revalidate: 3600
  }
}