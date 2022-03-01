import { React, useEffect, useState } from 'react'
import { ColorName, ColorDivision, ColorTeam, ColorNumber, ArrowNumber, ColorPosition, ColorNationality, ArrowDivision } from './TableStyler'

import { Header } from './Header'
import { Footer } from './Footer'

import './styles/Home.css'
import './styles/customTable.css'
import { Button, Spinner, Modal } from 'react-bootstrap'
import { Autocomplete, TextField } from '@mui/material'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [loadingActivePlayers, setLoadingActivePlayers] = useState(true)
  const [showGameOverModal, setShowGameOverModal] = useState(false)

  const [allTeams, setAllTeams] = useState([])
  const [activePlayers, setActivePlayers] = useState([])
  const [playerAnswer, setPlayerAnswer] = useState([])

  const [guesses, setGuesses] = useState([])
  const [curGuess, setCurGuess] = useState(null)

  const [gameOver, setGameOver] = useState(false)
  const [victory, setVictory] = useState(false)

  const handleCloseGameOverModal = () => setShowGameOverModal(false)
  const handleShowGameOverModal = () => setShowGameOverModal(true)


  // Fetch all active NHL players.
  useEffect(() => {
    async function getData() {
      const url = "https://statsapi.web.nhl.com/api/v1"

      const teams = await fetch(`${url}/teams`)
        .then((res) => res.json())
        .then((json) => json['teams'])

      const rosters = await Promise.all(teams.map((team) =>
        fetch(`${url}/teams/${team.id}/roster`)
          .then((res) => res.json())
          .then((json) => json['roster'])
      ))

      const playerIDs = rosters.map((roster) =>
        roster.map((player) => player.person.id)
      )

      const mergedIDs = [].concat.apply([], playerIDs)

      const players = await Promise.all(mergedIDs.map((id) =>
        fetch(`${url}/people/${id}`)
          .then((res) => res.json())
          .then((json) => json['people'][0])
      ))

      setAllTeams(teams)
      setActivePlayers(players)
      setLoadingActivePlayers(false)
    }

    getData()
  }, [])


  // Get random active player.
  useEffect(() => {
    if (!loadingActivePlayers) {
      const min = 0
      const max = activePlayers.length - 1
      const rand = Math.floor(min + (Math.random() * (max - min)))

      setPlayerAnswer(activePlayers[rand])
    }
  }, [loadingActivePlayers, activePlayers])


  // Control loading state.
  useEffect(() => {
    if (playerAnswer.length !== 0) {
      playerAnswer.division = getDivision(playerAnswer.currentTeam.id)
      setLoading(false)
    }
  }, [playerAnswer])


  // Helper function to return a player's division.
  function getDivision(id) {
    return (allTeams.find(team => team.id === id).division.nameShort)
  }


  // Writes to local storage to save statistics.
  function writeToLocal(result) {
    let streak = localStorage.getItem("hertl_CurStreak")
    let totalWins = localStorage.getItem("hertl_TotalWins")
    let totalLosses = localStorage.getItem("hertl_TotalLosses")

    if (streak === null) { streak = 0 }
    if (totalWins === null) { totalWins = 0 }
    if (totalLosses === null) { totalLosses = 0 }

    if (result === "win") {
      streak++
      totalWins++
      localStorage.setItem("hertl_CurStreak", JSON.stringify(streak))
      localStorage.setItem("hertl_TotalWins", JSON.stringify(totalWins))
    } else if (result === "loss") {
      totalLosses++
      localStorage.setItem("hertl_CurStreak", JSON.stringify(0))
      localStorage.setItem("hertl_TotalLosses", JSON.stringify(totalLosses))
    }
  }


  // Modal panel that shows on win/loss.
  function GameOverModal() {
    const title = victory ? "Nice!" : "Game Over"
    const body = victory ?
      `You correctly guessed ${playerAnswer.fullName} in ${guesses.length} tries.` :
      `The correct player was ${playerAnswer.fullName}. Better luck next time!`

    return (
      <Modal centered show={showGameOverModal} onHide={handleCloseGameOverModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {body}
          <table className="table table-striped custom-table" style={{ marginTop: '1rem' }}>
            <tbody>
              <tr>
                <td style={{ width: '8rem' }}>{playerAnswer.fullName}</td>
                <td style={{ width: '8rem' }}>{playerAnswer.division}</td>
                <td style={{ width: '8rem' }}>{playerAnswer.currentTeam.name}</td>
                <td style={{ width: '8rem' }}>{playerAnswer.primaryNumber}</td>
                <td style={{ width: '8rem' }}>{playerAnswer.primaryPosition.abbreviation}</td>
                <td style={{ width: '8rem' }}>{playerAnswer.nationality}</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    )
  }


  // Helper function for starting new game.
  const handleNewGame = () => {
    setGuesses([])

    const min = 0
    const max = activePlayers.length - 1
    const rand = Math.floor(min + (Math.random() * (max - min)))
    setPlayerAnswer(activePlayers[rand])

    setGameOver(false)
    setVictory(false)
  }


  // Button for starting new game.
  const NewGameButton = () => {
    return (
      <Button
        className="new-game-button"
        variant="outline-light"
        size="lg"
        disabled={!gameOver}
        onClick={handleNewGame}
      >
        Start a New Game
      </Button>
    )
  }


  // Runs when a guess is made.
  const handleGuess = () => {
    if (curGuess === playerAnswer) {
      setVictory(true)
      setGameOver(true)
      writeToLocal("win")
      handleShowGameOverModal()
    } else {
      if (guesses.length === 9) {
        setVictory(false)
        setGameOver(true)
        writeToLocal("loss")
        handleShowGameOverModal()
      }
    }

    setGuesses(guesses.concat(curGuess))
    setCurGuess(null)
  }


  // Input field where guesses are made.
  const GuessBox = () => {
    return (
      <Autocomplete
        className="player-guess-box"
        disablePortal
        disabled={gameOver}
        id="guess-box"
        value={curGuess}
        onChange={(_event, newGuess) => { setCurGuess(newGuess) }}
        options={activePlayers}
        getOptionLabel={(option) => `${option.fullName}`}
        renderInput={(params) => <TextField {...params} label="Choose a Player" />}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.fullName}
            </li>
          )
        }}
      />
    )
  }


  // Submit button for guesses.
  const GuessButton = () => {
    return (
      <Button
        className="guess-button"
        size="lg"
        disabled={curGuess === null}
        onClick={handleGuess}
      >
        GUESS
      </Button>
    )
  }


  // Table to display user's guesses.
  function PlayerGuesses() {
    const entries = guesses.map((guess) => (
      <tr key={guess.id}>
        <td style={{ background: ColorName(playerAnswer, guess) }}>{guess.fullName}</td>
        <td style={{ background: ColorDivision(playerAnswer.division, getDivision(guess.currentTeam.id)) }}>{getDivision(guess.currentTeam.id)} {ArrowDivision(playerAnswer.division, getDivision(guess.currentTeam.id))}</td>
        <td style={{ background: ColorTeam(playerAnswer, guess) }}>{guess.currentTeam.name}</td>
        <td style={{ background: ColorNumber(playerAnswer, guess) }}>{guess.primaryNumber} {ArrowNumber(playerAnswer, guess)}</td>
        <td style={{ background: ColorPosition(playerAnswer, guess) }}>{guess.primaryPosition.abbreviation}</td>
        <td style={{ background: ColorNationality(playerAnswer, guess) }}>{guess.nationality}</td>
      </tr>
    ))

    return (
      <table className="table table-striped custom-table">
        <thead>
          <tr>
            <th scope="col">Player</th>
            <th scope="col">Div</th>
            <th scope="col">Team</th>
            <th scope="col">#</th>
            <th scope="col">Pos</th>
            <th scope="col">Nat</th>
          </tr>
        </thead>
        <tbody>
          {entries}
        </tbody>
      </table>
    )
  }


  return (
    <div className="main">
      <Header number={guesses.length} />
      <div className="main-body">
        {loading ? (
          <div>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div>
            {gameOver ? <NewGameButton /> : null}
            <PlayerGuesses />
            <GameOverModal />
            <div className="guess-input">
              <GuessBox />
              <GuessButton />
            </div>
          </div>
        )}
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}