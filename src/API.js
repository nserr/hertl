import { useState } from 'react'

export default function GetPlayer() {
  fetch("https://statsapi.web.nhl.com/api/v1/people/8477474")
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result.items)
      }
    )
}