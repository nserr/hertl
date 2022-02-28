import { React, useEffect, useState } from 'react'
import { Test } from './API'
import { ColorName, ColorDivision, ColorTeam, ColorNumber, ArrowNumber, ColorPosition, ColorNationality, ArrowDivision } from './TableStyler'

import './Home.css'
import './customTable.css'
import { Table, Button } from 'react-bootstrap'
import { Autocomplete, TextField } from '@mui/material';


export default function Home() {
  const [loading, setLoading] = useState(true)
  const [loadingActivePlayers, setLoadingActivePlayers] = useState(true)

  const [allTeams, setAllTeams] = useState([])
  const [activePlayers, setActivePlayers] = useState([])
  const [playerAnswer, setPlayerAnswer] = useState([])

  const [guesses, setGuesses] = useState([])
  const [curGuess, setCurGuess] = useState(null)

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

    console.log(playerAnswer)

  }, [playerAnswer])


  function getDivision(id) {
    return (allTeams.find(team => team.id === id).division.nameShort)
  }

  const handleGuess = () => {
    setGuesses(guesses.concat(curGuess))

    if (curGuess === playerAnswer) {
      console.log('win')
    } else {
      console.log('loss')
    }

    setCurGuess(null)
  }


  const GuessBox = () => {
    return (
      <Autocomplete
        disablePortal
        id="guess-box"
        sx={{ width: 600 }}
        value={curGuess}
        onChange={(_event, newGuess) => { setCurGuess(newGuess) }}
        options={activePlayers}
        getOptionLabel={(option) => `${option.fullName}`}
        renderInput={(params) => <TextField {...params} label="Player" />}
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

  const GuessButton = () => {
    return (
      <Button
        variant="success"
        size="lg"
        disabled={curGuess === null}
        onClick={handleGuess}
      >
        Guess
      </Button>
    )
  }

  function PlayerGuesses() {
    const entries = guesses.map((guess) => (
      <tr key={guess.id}>
        <td className="guess-number">{guesses.indexOf(guess)+1}</td>
        <td style={{ background: ColorName(playerAnswer, guess)}}>{guess.fullName}</td>
        <td style={{ background: ColorDivision(playerAnswer.division, getDivision(guess.currentTeam.id))}}>{getDivision(guess.currentTeam.id)} {ArrowDivision(playerAnswer.division, getDivision(guess.currentTeam.id))}</td>
        <td style={{ background: ColorTeam(playerAnswer, guess) }}>{guess.currentTeam.name}</td>
        <td style={{ background: ColorNumber(playerAnswer, guess) }}>{guess.primaryNumber} {ArrowNumber(playerAnswer, guess)}</td>
        <td style={{ background: ColorPosition(playerAnswer, guess)}}>{guess.primaryPosition.abbreviation}</td>
        <td style={{ background: ColorNationality(playerAnswer, guess)}}>{guess.nationality}</td>
      </tr>
    ))

    return (
      <table className="table table-striped custom-table">
        <thead>
          <tr>
            <th className="guess-number" scope="col">Guess</th>
            <th scope="col">Player</th>
            <th scope="col">Division</th>
            <th scope="col">Team</th>
            <th scope="col">Number</th>
            <th scope="col">Position</th>
            <th scope="col">Nationality</th>
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
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          {console.log(playerAnswer)}
          <PlayerGuesses />
          <GuessBox />
          <GuessButton />

        </div>
      )}
    </div>
  )
}
