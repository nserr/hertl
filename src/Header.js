import React from 'react'
import { Image } from 'react-bootstrap'
import './styles/Header.css'
import hertlLogo from './images/hertlLogo.png'

export function Header() {
  return (
    <div className="header-main">
      <div className="header-name">
        <Image className="logo" src={hertlLogo} />
      </div>
    </div>
  )
}
