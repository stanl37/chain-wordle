import { LetterState } from '../types'
import ls from '../router/localStore'

/**
 * Parse a sentence into an array of words, and provide relevant information about said array.
 * 
 * Params:
 *  - sentence: a string representing a sentence to split
 */
export function parseSentence(sentence:string) {
  const msgArray = sentence.split(' ')
  if (msgArray == null) { return [0, 0, []] }
  const num_words = msgArray.length

  // TODO: make into lambda?
  function findLongestWord(msgArray: string[]) {
    var longestWord = [...msgArray].sort(function(a, b) { return b.length - a.length; });
    return longestWord[0].length;
  }
  const max_word_length = findLongestWord(msgArray);

  return [num_words, max_word_length, msgArray] as const
}


/**
 * Store a main board into local storage.
 * 
 * Params:
 *  - guesses: how many guesses each Wordle game is allowed. Default: 6
 *  - num_words: the number of words in the input sentence
 *  - max_word_length: the maximum length of any word in the input sentence
 *  - msgArray: the array of words from the input sentence
 */
export function storeMainBoard(guesses:number, num_words:number, max_word_length:number, msgArray:string[]) {
  
  // game template
  let game_template = {
    solution: "",
    gameStatus: "IN_PROGRESS",  // IN_PROGRESS, WON, LOST
    rowIndex: 0,
    board_height: 0,
    board_length: 0,
    currentWords: null,
    evaluations: null,
  }
  
  let existing = ls.get('main');
  if (!existing) {
    let main_dict = {}
    main_dict['num_words'] = num_words
    main_dict['max_word_length'] = max_word_length
    for (let i = 0; i < msgArray.length; i++) {
      let game = JSON.parse(JSON.stringify(game_template))
      game['solution'] = msgArray[i]
      game['board_height'] = guesses
      game['board_length'] = msgArray[i].length
      game['currentWords'] = Array(guesses).fill("")
      game['evaluations'] = Array(guesses).fill(Array(msgArray[i].length).fill(null))
      main_dict[`game${i}`] = game
    }
    ls.set(`main`, main_dict)
  }
}

/**
 * Create a main board, by creating an empty board then loading in information from local storage.
 * 
 * Params:
 *  - None
 * Requirements:
 *  - Board information must be saved in Local Storage
 */
export function createMainBoardObject() {
  let data = ls.get('main')
  let board = createEmptyBoardObject(data['num_words'], data['max_word_length'])
  updateMainBoardObject(board)
  return board
}

/**
 * Create an empty board.
 * Used in creating the main board (each row is a different word, for the main screen).
 * Also used in creating game boards (regular Wordle).
 * 
 * @param rows how many rows to have (how many words in the sentence, how many guesses in the Wordle)
 * @param row_length how many boxes per row (word length)
 * @returns Board object
 */
export function createEmptyBoardObject(rows:number, row_length:number) {
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

/**
 * Construct a main board from local storage.
 * 
 * Params:
 *  - board: a game board, likely created by generateEmptyBoard.
 */
export function updateMainBoardObject(board:{ letter: string; state: LetterState; }[][]) {

  let data = ls.get('main') 
  let games = 0
  for(let key in data) {
    if (key.includes('game')) { games++ }
  }

  for (let i = 0; i < games; i++) {
    const currentRow = board[i]
    const currentWord = data[`game${i}`]['solution']
    
    let gameStatus = data[`game${i}`]['gameStatus']
    console.log(`Game${i} status:`, gameStatus)
    let state
    switch (gameStatus) {
      case "IN_PROGRESS":
        state = LetterState.HIDDEN
        break
      case "WON":
        state = LetterState.CORRECT
        break
      case "LOST":
        state = LetterState.INCORRECT
        break
      default:
        state = LetterState.INITIAL
        break
    }
    for (let j = 0; j < currentWord.length; j++) {
      currentRow[j].letter = currentWord[j]
      currentRow[j].state = state
    }
  }
  
}

export * as utils from './gameutils'