import '../styles/globals.scss'
import styles from '../styles/app.module.scss'
import Header from '../components/Header'
import Player from '../components/Player'
import { PlayProvider } from '../contexts/PlayContext'
import { AppProps } from 'next/app'
import Head from 'next/head'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    
    <div className={styles.wrapper}>
      <Head>
        <title>Podcastr</title>
      </Head>
      <PlayProvider>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </PlayProvider>
    </div>
  )
}

export default MyApp
