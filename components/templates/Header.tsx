import React, { FC, useState, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useRouter } from 'next/router'
import UpArrow from 'assets/svg/up-arrow-circle.svg'

const tl = gsap.timeline()

interface Dimentions {
  height: number
  width: number
}

const Header: FC<{ history; dimentions: Dimentions }> = ({
  history,
  dimentions,
}) => {
  const [menuState, setMenuState] = useState({ menuOpened: false })
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => {
      setMenuState({ menuOpened: false })
    }

    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  useEffect(() => {
    if (menuState.menuOpened === true) {
      tl.to('nav', { css: { display: 'block' } })
        .to('body', {
          css: { overflow: 'hidden' },
        })
        .to('.App', {
          duration: 1,
          y: dimentions.width <= 654 ? '70vh' : dimentions.height / 2,
          ease: 'expo.inOut',
        })
        .to('.hamburger-menu span', 0.6, {
          delay: -1,
          scaleX: 0,
          transformOrigin: '50% 0%',
          ease: 'expo.inOut',
        })
        .to('#Path_1', {
          duration: 0.4,
          delay: -0.6,
          css: {
            strokeDashoffset: 10,
            strokeDasharray: 5,
          },
        })
        .to('#Path_2', {
          duration: 0.4,
          delay: -0.6,
          css: {
            strokeDashoffset: 10,
            strokeDasharray: 20,
          },
        })
        .to('#Line_1', {
          duration: 0.4,
          delay: -0.6,
          css: {
            strokeDashoffset: 40,
            strokeDasharray: 18,
          },
        })
        .to('#circle', {
          duration: 0.6,
          delay: -0.8,
          css: {
            strokeDashoffset: 0,
          },
        })
        .to('.hamburger-menu-close', {
          duration: 0.6,
          delay: -0.8,
          css: {
            display: 'block',
          },
        })
    } else {
      tl.to('.App', {
        duration: 1,
        y: 0,
        ease: 'expo.inOut',
      })
        .to('#circle', {
          duration: 0.6,
          delay: -0.6,
          css: {
            strokeDashoffset: -193,
            strokeDasharray: 227,
          },
        })
        .to('#Path_1', {
          duration: 0.4,
          delay: -0.6,
          css: {
            strokeDashoffset: 10,
            strokeDasharray: 10,
          },
        })
        .to('#Path_2', {
          duration: 0.4,
          delay: -0.6,
          css: {
            strokeDashoffset: 10,
            strokeDasharray: 10,
          },
        })
        .to('#Line_1', {
          duration: 0.4,
          delay: -0.6,
          css: {
            strokeDashoffset: 40,
            strokeDasharray: 40,
          },
        })
        .to('.hamburger-menu span', {
          duration: 0.6,
          delay: -0.6,
          scaleX: 1,
          transformOrigin: '50% 0%',
          ease: 'expo.inOut',
        })
        .to('.hamburger-menu-close', {
          duration: 0,
          delay: -0.1,
          css: {
            display: 'none',
          },
        })
        .to('body', {
          css: {
            overflow: 'auto',
          },
        })
        .to('nav', {
          duration: 0,
          css: {
            display: 'none',
          },
        })
    }
  })

  return (
    <div className="header">
      <div className="container">
        <div className="row v-center space-between">
          <div className="logo">
            <Link href="/">FOOLS.</Link>
          </div>
          <div className="nav-toggle">
            <div
              onClick={() => setMenuState({ menuOpened: true })}
              className="hamburger-menu"
            >
              <span></span>
              <span></span>
            </div>
            <div
              onClick={() => setMenuState({ menuOpened: false })}
              className="hamburger-menu-close"
            >
              <UpArrow />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
