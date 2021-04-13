import React, { FC } from 'react'
import RightArrow from 'assets/svg/arrow-right.svg'

const Banner: FC = () => {
  return (
    <section className="main">
      <div className="container">
        <div className="row">
          <h2>
            <div className="line">
              <span>Creating unique design is</span>
            </div>
            <div className="line">
              <span>what I do.</span>
            </div>
          </h2>
          <div className="btn-row">
            <a href="/">
              More about me
              <RightArrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
