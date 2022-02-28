import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

const green = '#97C1A9'
const yellow = '#FFC8A2'
const transparent = 'transparent'

export function ColorName(answer, guess) {
  if (answer.fullName === guess.fullName) {
    return green
  } else if (answer.firstName === guess.firstName || answer.lastName === guess.lastName) {
    return yellow
  } else {
    return transparent
  }
}

export function ColorDivision(answer, guess) {
  if (answer === guess) {
    return green
  } else {
    return transparent
  }
}

export function ArrowDivision(answer, guess) {
  const map = {
    'PAC': 1,
    'CEN': 2,
    'ATL': 3,
    'Metro': 4
  }

  if (map[answer] > map[guess]) {
    return <FontAwesomeIcon icon={faArrowRight}/>
  } else if (map[answer] < map[guess]) {
    return <FontAwesomeIcon icon={faArrowLeft}/>
  } else {
    return null
  }
}

export function ColorTeam(answer, guess) {
  if (answer.currentTeam.name === guess.currentTeam.name) {
    return green
  } else {
    return transparent
  }
}

export function ColorNumber(answer, guess) {
  if (answer.primaryNumber === guess.primaryNumber) {
    return green
  } else {
    return transparent
  }
}

export function ArrowNumber(answer, guess) {
  const answerInt = parseInt(answer.primaryNumber, 10)
  const guessInt = parseInt(guess.primaryNumber, 10)
  
  if (answerInt > guessInt) {
    return <FontAwesomeIcon icon={faArrowUp}/>
  } else if (answerInt < guessInt) {
    return <FontAwesomeIcon icon={faArrowDown}/>
  } else {
    return null
  }
}

export function ColorPosition(answer, guess) {
  if (answer.primaryPosition.abbreviation === guess.primaryPosition.abbreviation) {
    return green
  } else if (answer.primaryPosition.type === guess.primaryPosition.type) {
    return yellow
  } else {
    return transparent
  }
}

export function ColorNationality(answer, guess) {
  if (answer.nationality === guess.nationality) {
    return green
  } else {
    return transparent
  }
}