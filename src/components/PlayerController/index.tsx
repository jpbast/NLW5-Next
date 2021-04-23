import React, { useContext, useState, useRef, useEffect } from 'react'
import { PlayContext } from '../../contexts/PlayContext'
import styles from './styles.module.scss'
import { formatDuration } from '../../utils/formatDuration'

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

export default function PlayerController() {
  const { playlist, playlistIndex } = useContext(PlayContext)
  const [play, setPlay] = playlist
  const [index, setIndex] = playlistIndex
  const [time, setTime] = useState(0)
  // prevPause registra o estado ANTERIOR do atual em relação ao pause.
  // Quando o áudio estiver PAUSADO e o usuário mexer no slider, o áudio
  // deve seguir pausado quando soltar o slider. Se áudio estiver rodando,
  // deve permanecer rodando quando soltar o slider. Esse é o controle
  // que o prevPause realiza.
  const [prevPause, setPrevPause] = useState(true)
  const [pause, setPause] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  let playOrder = useRef<number[]>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const range = useRef<HTMLDivElement>(null)
  const episode = play[index]

  useEffect(() => { range.current.style.width = calcRange(time) }, [time])

  useEffect(() => { playOrder.current = Array.from(Array(play.length).keys()) }, [play])

  useEffect(() => {
    if (shuffle)
      playOrder.current = playOrder.current.sort(() => Math.random() - 0.5)
  }, [shuffle])

  function calcRange(num: number) {
    return `${(num / episode?.file.duration) * 100}%`
  }

  function findNext(next: boolean) {
    const i = playOrder.current.indexOf(index)
    if (play.length === 1) {
      setPlay([])
      range.current.style.width = '0%';
    } else 
      if (next) 
        i === playOrder.current.length - 1 ? setIndex(playOrder.current[0]) : setIndex(playOrder.current[i+1])
      else
        i  === 0 ? setIndex(playOrder.current[playOrder.current.length - 1]) : setIndex(playOrder.current[i-1])
  }

  function handleInput(e) {
    setTime(e.target.value)
    if (!audio.current.paused) {
      setPrevPause(false)
      audio.current.pause()
    }
    audio.current.currentTime = e.target.value
  }

  function handlePlayButton() {
    if (episode) {
      pause ? audio.current.play() : audio.current.pause()
      setPause(!pause)
    }
  }
  
  return (
    <div className={styles.playerController}>
      <div style={episode ? {opacity: '1'} : {opacity: '0.5'}} className={styles.podcastSlider}>
        <span>{!episode ? '00:00' : formatDuration(Math.floor(time))}</span>  

        <div className={styles.playerSliderContainer}>
          <div className={styles.slider} />
          <div ref={range} className={styles.sliderTrack} />
          { episode && (
             <input 
             min={0} 
             max={episode.file.duration} 
             value={time} 
             onMouseUp={() => !prevPause ? (audio.current.play(), setPrevPause(true)) : null}
             onChange={handleInput} 
             step={1} 
             type="range"
           />
          ) }
        </div>
        <span>{!episode ? '00:00' : episode.file.durationFormatted}</span>
      </div>

      { episode && (
        <audio 
        loop={repeat ? true : false}
        autoPlay={pause ? false : true}
        ref={audio}
        onEnded={() => findNext(true)}
        onTimeUpdate={(e: any) => setTime(e.target.currentTime)} 
        id="audio" 
        src={episode.file.url} 
      />
      )}

      <div className={styles.buttons}>
        <button disabled={!episode || play.length === 1} className={shuffle ? styles.selected : ''} onClick={() => setShuffle(!shuffle)}>
          <img src="/shuffle.svg" alt="Shuffle"/>
        </button>
        <button disabled={!episode || play.length === 1} onClick={() => shuffle ? findNext(false) : setIndex(index - 1)}>
          <img src="/play-previous.svg" alt="Play previous"/>
        </button>
        <button disabled={!episode} style={!pause ? {backgroundColor: 'var(--purple-800)'} : {}} onClick={handlePlayButton}>
          <img src={pause || !episode ? "/play.svg" : "/pause.svg"} alt="Play/Pause"/>
        </button>
        <button disabled={!episode || play.length === 1} onClick={() => shuffle ? findNext(true) : setIndex(index + 1)}>
          <img src="/play-next.svg" alt="Play next"/>
        </button>
        <button disabled={!episode} className={repeat ? styles.selected : ''} onClick={() => setRepeat(!repeat)}>
          <img src="/repeat.svg" alt="Repeat"/>
        </button>
      </div>
    </div>
  )
}
