import Link from 'next/link'
import React, { FC, useEffect } from 'react'
import Header from 'components/templates/header'
import Banner from 'components/molcules/banner'
import Cases from 'components/molcules/cases'

const Home: FC = () => {
  useEffect(() => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  })

  return (
    <div className="App">
      <Header />
      <Banner />
      <Cases />
    </div>
  )
}

export default Home
