import { React, useEffect, useState } from 'react'
import './Home.css'
import { Test } from './API'

import { Table } from 'react-bootstrap'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [roster, setRoster] = useState([])
  const [player, setPlayer] = useState([])


  // Get random team roster.
  useEffect(() => {
    const min = 1
    const max = 32
    const rand = Math.floor(min + (Math.random() * (max - min)))

    fetch(`https://statsapi.web.nhl.com/api/v1/teams/${rand}/roster`)
      .then((res) => res.json())
      .then((json) => setRoster(json['roster']))
      .catch((error) => console.log(error))

  }, [])

  // Get random player from set roster.
  useEffect(() => {
    if (roster.length !== 0) {
      const min = 0
      const max = roster.length - 1
      const rand = Math.floor(min + (Math.random() * (max - min)))
      const id = roster[rand].person.id

      fetch(`https://statsapi.web.nhl.com/api/v1/people/${id}`)
        .then((res) => res.json())
        .then((json) => setPlayer(json['people']))
        .catch((error) => console.log(error))
    }

  }, [roster])

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
            <th>Team</th>
            <th>Number</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{player[0].firstName} {player[0].lastName}</td>
            <td>{player[0].currentTeam.name}</td>
            <td>{player[0].primaryNumber}</td>
            <td>{player[0].primaryPosition.abbreviation}</td>
          </tr>
          <tr>
            <td>2</td>
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
