import React, { FC } from 'react'
import Link from 'next/link'

const Header: FC = () => {
  return (
    <div className="header">
      <div className="container">
        <div className="row v-center space-between">
          <div className="logo">
            <Link href="/">FOOLS.</Link>
          </div>
          <div className="nav">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
