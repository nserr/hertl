import { React, useEffect, useState } from 'react'
import './Home.css'
import { Test } from './API'

import { Table } from 'react-bootstrap'
import { Autocomplete } from '@mui/material';

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [activePlayers, setActivePlayers] = useState([])
  const [player, setPlayer] = useState([])

  // Fetch all active NHL players.
  useEffect(() => {
    fetch("https://statsapi.web.nhl.com/api/v1/teams")
      .then((res) => res.json())
      .then((json) => {
        json.teams.forEach((team) => {
          fetch(`https://statsapi.web.nhl.com/api/v1/teams/${team.id}/roster`)
            .then((res) => res.json())
            .then((json) => {
              json.roster.forEach((player) => {
                fetch(`https://statsapi.web.nhl.com/api/v1/people/${player.person.id}`)
                  .then((res) => res.json())
                  .then((json) => json['people'])
                  .then((player) => {
                    setActivePlayers(activePlayers => [...activePlayers, player[0]])
                  })
              })
            })
        })
      })
  }, [])

  // Get random active player.
  useEffect(() => {
    if (activePlayers.length !== 0) {
      const min = 0
      const max = activePlayers.length - 1
      const rand = Math.floor(min + (Math.random() * (max - min)))

      setPlayer(activePlayers[rand])
    }

  }, [activePlayers])

  // Control loading state.
  useEffect(() => {
    if (player.length !== 0) {
      setLoading(false)
    }

    console.log(player)

  }, [player])

  // API testing.
  const handleClick = () => {
    Test()
  }

  const PlayerTable = () => {
    return (
      <Table striped bordered hover>
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
            <td>{player.fullName}</td>
            <td></td>
            <td>{player.currentTeam.name}</td>
            <td>{player.primaryNumber}</td>
            <td>{player.primaryPosition.abbreviation}</td>
            <td></td>
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
    <div>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div><PlayerTable /></div>
      )}

      <button onClick={handleClick}>
        test
      </button>
    </div>
  )
}
