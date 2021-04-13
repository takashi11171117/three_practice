import { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import Head from 'next/head'
import Header from 'components/templates/header'
import Navigation from 'components/templates/navigation'
import 'styles/globals.scss'

const debounce = <F extends (...args: any) => any>(fn: F, ms: number) => {
  let timer: NodeJS.Timeout
  return (...args: any) => {
    clearTimeout(timer)
    setTimeout(() => fn(...args), ms)
  }
}

const App = ({ Component, pageProps, router }: AppProps) => {
  const [dimentions, setDimentions] = useState({
    height: 0,
    width: 0,
  })

  useEffect(() => {
    gsap.to('body', 0, { css: { visibility: 'visible' } })
    setDimentions({
      height: window.innerHeight,
      width: window.innerWidth,
    })
  }, [])

  useEffect(() => {
    const vh = dimentions.height * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)

    const debouncedHandleResize = debounce(() => {
      console.log(dimentions)
      setDimentions({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* <link rel="shortcut icon" href="/favicon.png" key="shortcutIcon" /> */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
      </Head>
      <Header dimentions={dimentions} />
      <div className="App">
        <Component {...pageProps} />
      </div>
      <Navigation />
    </>
  )
}

export default App
