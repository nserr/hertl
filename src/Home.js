import { React, useEffect, useState } from 'react'
import './Home.css'
import { Test } from './API'

import { Table } from 'react-bootstrap'
import { Autocomplete, TextField } from '@mui/material';

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [loadingActivePlayers, setLoadingActivePlayers] = useState(true)

  const [activePlayers, setActivePlayers] = useState([])
  const [playerAnswer, setPlayerAnswer] = useState([])

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
      setLoading(false)
    }

    console.log(playerAnswer)

  }, [playerAnswer])


  // API testing.
  const handleClick = () => {
    Test()
  }

  
  const PlayerTable = () => {
    return (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Guess</th>
            <th>Player</th>
            <th>Division</th>
            <th>Team</th>
            <th>Number</th>
            <th>Position</th>
            <th>Nationality</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{playerAnswer.fullName}</td>
            <td></td>
            <td>{playerAnswer.currentTeam.name}</td>
            <td>{playerAnswer.primaryNumber}</td>
            <td>{playerAnswer.primaryPosition.abbreviation}</td>
            <td>{playerAnswer.nationality}</td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>3</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    )
  }

  return (
    <div className="main">
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          <PlayerTable />
          <Autocomplete
            disablePortal
            id="combo-box"
            options={activePlayers}
            getOptionLabel={(option) => `${option.fullName}`}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.fullName}
                </li>
              )
            }}
            sx={{ width: 600 }}
            renderInput={(params) => <TextField {...params} label="Player" />}
          />
        </div>
      )}

      <button onClick={handleClick}>
        test
      </button>
    </div>
  )
}
