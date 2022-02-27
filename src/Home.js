import { React, useEffect, useState } from 'react'
import './Home.css'
import GetPlayer from './API'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [player, setPlayer] = useState([])

  useEffect(() => {
    const url = "https://statsapi.web.nhl.com/api/v1/people/8477474"
    fetch(url)
      .then((res) => res.json())
      .then((json) => setPlayer(json['people']))
      .catch((error) => console.log(error))
  }, [])

  useEffect(() => {
    if (player.length !== 0) {
      setLoading(false)
    }

    console.log(player)

  }, [player])

  return (
    <div>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>{player[0].firstName} {player[0].lastName}</div>
      )}
    </div>
  )
}
