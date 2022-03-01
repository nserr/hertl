import { useState } from 'react'
import { Image, Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faChartLine, faArrowLeft, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import hertlLogo from './images/hertlLogo.png'
import './styles/Header.css'
import './styles/customTable.css'

export function Header(props) {
  const [showRulesModal, setShowRulesModal] = useState(true)
  const [showStatsModal, setShowStatsModal] = useState(false)

  const handleShowRulesModal = () => setShowRulesModal(true)
  const handleCloseRulesModal = () => setShowRulesModal(false)

  const handleShowStatsModal = () => setShowStatsModal(true)
  const handleCloseStatsModal = () => setShowStatsModal(false)

  const green = '#97C1A9'
  const orange = '#FFC8A2'

  function RulesTable1() {
    return (
      <table className="table table-striped custom-table" style={{ marginTop: '1rem' }}>
        <tbody>
          <tr>
            <td style={{ width: '8rem' }}>Adam Pelech</td>
            <td style={{ width: '8rem' }}>Metro <FontAwesomeIcon icon={faArrowLeft} /></td>
            <td style={{ width: '8rem' }}>New York Islanders</td>
            <td style={{ width: '8rem' }}>3 <FontAwesomeIcon icon={faArrowUp} /></td>
            <td style={{ width: '8rem' }}>D</td>
            <td style={{ width: '8rem' }}>CAN</td>
          </tr>
        </tbody>
      </table>
    )
  }

  function RulesTable2() {
    return (
      <table className="table table-striped custom-table" style={{ marginTop: '1rem' }}>
        <tbody>
          <tr>
            <td style={{ width: '8rem', background: orange }}>Frederick Gaudreau</td>
            <td style={{ width: '8rem' }}>CEN <FontAwesomeIcon icon={faArrowLeft} /></td>
            <td style={{ width: '8rem' }}>Minnesota Wild</td>
            <td style={{ width: '8rem' }}>89 <FontAwesomeIcon icon={faArrowDown} /></td>
            <td style={{ width: '8rem', background: orange }}>C</td>
            <td style={{ width: '8rem' }}>CAN</td>
          </tr>
        </tbody>
      </table>
    )
  }

  function RulesTable3() {
    return (
      <table className="table table-striped custom-table" style={{ marginTop: '1rem' }}>
        <tbody>
          <tr>
            <td style={{ width: '8rem', background: green }}>Johnny Gaudreau</td>
            <td style={{ width: '8rem', background: green }}>PAC</td>
            <td style={{ width: '8rem', background: green }}>Calgary Flames</td>
            <td style={{ width: '8rem', background: green }}>13</td>
            <td style={{ width: '8rem', background: green }}>LW</td>
            <td style={{ width: '8rem', background: green }}>USA</td>
          </tr>
        </tbody>
      </table>
    )
  }

  function RulesModal() {
    return (
      <>
        <Button variant="outline-light" className="modal-button" onClick={handleShowRulesModal}>
          <FontAwesomeIcon icon={faQuestionCircle} title="Rules" />
        </Button>
        <Modal centered show={showRulesModal} onHide={handleCloseRulesModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              How to Play
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You have 10 attempts to guess the currently active NHL player.<br />
            If the correct player shares no attributes with your guess, the color of the cells will not change.
            {RulesTable1()}
            The arrows under Division point in the direction of the correct division.
            From West to East, that is <strong>Pacific</strong>, <strong>Central</strong>, <strong>Atlantic</strong>, <strong>Metropolitan</strong>.<br />
            The arrows under Number point in the direction of the correct player's jersey number.
            {RulesTable2()}
            An orange cell indicates a similarity. Under Player, the correct player shares either their first or last name with your guess.<br />
            Under Position, the correct player is a forward, but not the same position as your guess.
            {RulesTable3()}
            Use the clues from your guesses to narrow down the correct player!
          </Modal.Body>
        </Modal>
      </>
    )
  }

  function StatsModal() {
    let streak = parseInt(localStorage.getItem("hertl_CurStreak"), 10)
    if (isNaN(streak)) { streak = 0 }

    let totalWins = parseInt(localStorage.getItem("hertl_TotalWins"), 10)
    if (isNaN(totalWins)) { totalWins = 0 }

    let totalLosses = parseInt(localStorage.getItem("hertl_TotalLosses"), 10)
    if (isNaN(totalLosses)) { totalLosses = 0 }

    let winPercentage = Math.round(totalWins / (totalWins + totalLosses) * 100, 2)

    return (
      <>
        <Button variant="outline-light" className="modal-button" onClick={handleShowStatsModal}>
          <FontAwesomeIcon icon={faChartLine} title="Stats" />
        </Button>
        <Modal centered show={showStatsModal} onHide={handleCloseStatsModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Record
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="stats-container">
              <div className="stat-container">
                Current Streak:
                <div className="stat">
                  {streak}
                </div>
              </div>
              <div className="stat-container">
                Total Wins:
                <div className="stat">
                  {totalWins}
                </div>
              </div>
              <div className="stat-container">
                Total Losses:
                <div className="stat">
                  {totalLosses}
                </div>
              </div>
              <div className="stat-container">
                Win Percentage:
                <div className="stat">
                  {winPercentage}%
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    )
  }

  function GuessCounter() {
    return (
      <Button className="guess-counter" variant="light">
        {props.number} / 10
      </Button>
    )
  }

  const reset = () => {
    localStorage.removeItem("hertl_CurStreak")
    localStorage.removeItem("hertl_TotalWins")
    localStorage.removeItem("hertl_TotalLosses")

  }

  return (
    <>
      <div className="header-main">
        <div>
          <Image className="logo" src={hertlLogo} />
        </div>
      </div>
      <div className="header-buttons">
        <RulesModal />
        <GuessCounter />
        <StatsModal />
        <Button onClick={reset}>
          Reset
        </Button>
      </div>
    </>
  )
}
