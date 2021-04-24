import React, { createContext, useState } from 'react'

interface Episode {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  file: {
    url: string;
    type: string;
    duration: number;
    durationFormatted: string;
  }
}

type PlayContextType = {
  playlist: [Episode[], React.Dispatch<React.SetStateAction<object>>]
  playlistIndex: [number, React.Dispatch<React.SetStateAction<number>>]
}

export const PlayContext = createContext({} as PlayContextType)

export function PlayProvider({ children }) {
  const [play, setPlay] = useState([])
  const [index, setIndex] = useState()
  
  return (
    <PlayContext.Provider value={{ playlist: [play, setPlay], playlistIndex: [index, setIndex] }}>
      { children }
    </PlayContext.Provider>
  )
}
