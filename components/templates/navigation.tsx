import React, { FC } from 'react'
import Link from 'next/link'

const Navigation: FC = () => {
  return (
    <nav>
      <div className="container">
        <div className="nav-columns">
          <div className="nav-column">
            <div className="nav-label">Menu</div>
            <div className="nav-links">
              <li>
                <Link href="/merge-webgl">Merge Webgl</Link>
              </li>
              <li>
                <Link href="/glsl">GLSL</Link>
              </li>
              <li>
                <Link href="/three">Three</Link>
              </li>
              <li>
                <Link href="/case-studies">Case Studies</Link>
              </li>
              <li>
                <Link href="/approach">Approach</Link>
              </li>
              <li>
                <Link href="/services">Services</Link>
              </li>
              <li>
                <Link href="/about">About us</Link>
              </li>
            </div>
          </div>
          <div className="nav-column">
            <div className="nav-label">Contact</div>
            <div className="nav-infos">
              <div className="nav-info">
                <li className="nav-info-label">Email</li>
                <li>
                  <Link href="/contact">Get in touch with us</Link>
                </li>
                <li>
                  <Link href="/audit">Get a free audit</Link>
                </li>
              </div>
              <div className="nav-info">
                <li className="nav-info-label">Headquarters</li>
                <li>1 Osaka Jo</li>
                <li>Osaka City</li>
                <li>Japan</li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
