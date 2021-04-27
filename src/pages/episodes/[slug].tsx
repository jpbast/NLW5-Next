import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import { formatDuration } from '../../utils/formatDuration'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import styles from './episode.module.scss'
import { PlayContext } from '../../contexts/PlayContext'

interface Episode {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
    durationFormatted: string;
  }
}

type HomeProps = {
  data: Episode
}

export default function EpisodePage({ data }: HomeProps) {
  // Isso permite corrigir o "problema" do fallback: true
  // const router = useRouter()
  // verifica se a página está carregando
  // if (router.isFallback) {
  //   return <p>Crregando...</p>
  // }

  const { playlist, playlistIndex } = useContext(PlayContext)
  const setPlay = playlist[1]
  const setIndex = playlistIndex[1]

  return (
    <div className={styles.episodeWrapper}>
      <div className={styles.thumbnail}>
        <Image className={styles.img} width={1800} height={480} objectFit="cover" src={data.thumbnail} />
        <Link href="/">
          <button>
            <img src="/arrow-left.svg" alt="arrow left"/>
          </button>
        </Link>
        <button onClick={() => (setPlay([data]), setIndex(0))}>
          <img width="24px" src="/play.svg" alt="play"/>
        </button>
      </div>

      <div className={styles.episodeInfo}>
        <h1>{data.title}</h1>
        <span className={styles.dot}>{data.members}</span> 
        <span className={styles.dot}>{data.published_at}</span> 
        <span>{data.file.durationFormatted}</span>
        <div dangerouslySetInnerHTML={{__html: data.description}} />
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const episodes = await fetch('https://json-server-podcastr.herokuapp.com/episodes/')
    .then(res => res.json())
    .then(data => data)
    .catch(err => err)

  const paths = episodes.map(episode => `/episodes/${episode.id}`)
  
  return {
    paths,
    fallback: 'blocking'
  }

  //Incremental static regeneration
  //A opção fallback permite escolher como as páginas estáticas vão ser geradas.
  //blocking: A cada requisição de uma página que ainda não foi acessada, gera ela de maneira estática e armazena no
  //servidor do next. Isso é feito na camada do next e o usuário só é navegado para a página quando ela estiver pronta.
  //false: qualquer rota que não tenha sida definida em "path", irá retornar page not found (404)
  //true: semelhante ao blocking, mas a requisição é feita no lado do browser (cliente). O problema disso,
  //é que a página vai tentar renderizar e caso precise de alguma informação vinda do getStaticProps, pode ser
  //que esta informação ainda não tenha sido gerada (tempo de espera entre request e response) e vai acusar undefined.
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params

  const episode = await fetch(`https://json-server-podcastr.herokuapp.com/episodes/${slug}`)
    .then(res => res.json())
    .then(data => data)
    .catch(err => err)

  const data = {
    id: episode.id,
    title: episode.title,
    members: episode.members,
    description: episode.description,
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

  return {
    props: {
      data
    },
    revalidate: 3600
  }
}