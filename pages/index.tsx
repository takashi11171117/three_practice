import gsap from 'gsap'
import React, { FC, useEffect, useState } from 'react'
import IntroOverlay from 'components/molcules/introOverlay'
import Banner from 'components/molcules/banner'
import Cases from 'components/molcules/cases'

const homeAnimation = (completeAnimation: () => void) => {
  const tl = gsap.timeline()
  tl.from('.line span', 1.8, {
    y: 100,
    ease: 'power4.out',
    delay: 1,
    skewY: 7,
    stagger: {
      amount: 0.3,
    },
  })
    .to('.overlay-top', 1.6, {
      height: 0,
      ease: 'expo.inOut',
      stagger: 0.4,
    })
    .to('.overlay-bottom', 1.6, {
      width: 0,
      ease: 'expo.inOut',
      delay: -0.8,
      stagger: {
        amount: 0.4,
      },
    })
    .to('.intro-overlay', 0, { css: { display: 'none' } })
    .from('.case-image img', 1.8, {
      scale: 1.4,
      ease: 'expo.inOut',
      delay: -2,
      stagger: {
        amount: 0.4,
      },
      onComplete: completeAnimation,
    })
}

const Home: FC = () => {
  const [animationComplete, setAnimationComplete] = useState(false)

  const completeAnimation = () => {
    setAnimationComplete(true)
  }

  useEffect(() => {
    homeAnimation(completeAnimation)
  }, [])

  return (
    <div className="App">
      {animationComplete === false ? <IntroOverlay /> : ''}
      <Banner />
      <Cases />
    </div>
  )
}

export default Home
