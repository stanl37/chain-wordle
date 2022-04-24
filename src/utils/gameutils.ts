import { LetterState } from '../types'

export function generateEmptyBoard(rows:number, row_length:number) {
  let board = $ref(
    Array.from({ length: rows }, () =>
      Array.from({ length: row_length }, () => ({
        letter: '',
        state: LetterState.INITIAL
      }))
    )
  )
  return board
}

export * as utils from './gameutils'