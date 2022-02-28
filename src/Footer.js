import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright, faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import './styles/Footer.css'

export function Footer() {
  return (
    <div className="footer-main">
      <div>
        <FontAwesomeIcon icon={faCopyright} /> {new Date().getFullYear()} Noah Serr
      </div>
      <div>
        <a className="icon-link" href="https://github.com/nserr" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faGithub} title="GitHub" />
        </a>
        <a className="icon-link" href="https://www.linkedin.com/in/noahserr/" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faLinkedin} title="LinkedIn" />
        </a>
        <a className="icon-link" href="https://ko-fi.com/noahserr" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faCoffee} title="Buy me a coffee" />
        </a>
      </div>
    </div>
  )
}
