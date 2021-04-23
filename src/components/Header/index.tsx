import React from 'react'
import styles from './styles.module.scss'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export default function index() {
  const date = format(new Date(), 'eeeeee, d MMMM', {
    locale: ptBR
  })

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podscastr logo"/>     
      <p>O melhor para você ouvir, sempre</p>   
      <span>{date}</span>
    </header>
  )
}
