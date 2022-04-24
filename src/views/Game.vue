<script setup lang="ts">
import { onUnmounted } from 'vue'
import { getQuery } from '../query'
import { LetterState } from '../types'
import router from '../router/router'
import ls from '../router/localStore'
import { utils } from '../utils/gameutils';

import Keyboard from '../components/Keyboard.vue'

// Get data from local storage
const row_idx = getQuery('row')
let data = ls.get('main')
const game_data = data[`game${row_idx}`]

let guesses = game_data['board_height']
const answer = game_data['solution']
const word_length = game_data['board_length']

console.log("Answer for this game:", answer)
console.log("word_length:", word_length)

// Dynamically import length-n words
// DOESN'T WORK ON GITHUB PAGES
import { allWords1, allWords2, allWords3, allWords4, allWords5, allWords6, allWords7, allWords8, allWords9, allWords10, allWords11 } from '../data/words_data'
let allWordsArray = [allWords1, allWords2, allWords4, allWords5, allWords6, allWords7, allWords8, allWords9, allWords10, allWords11]
let allWords = allWordsArray[word_length]
console.log("allWords:", allWords)
/*
let allWords: string[]
async function getAllWords(): Promise<void> { 
  const myData = await import(`../data/words_data`);
  allWords = eval('myData.allWords' + word_length.toString())
  console.log("allWords:", allWords)
}
getAllWords()
*/

// Create Board object
let board = utils.createEmptyBoardObject(guesses, word_length)

// Current active row.
let currentRowIndex = $ref(0)
const currentRow = $computed(() => board[currentRowIndex])

// load up local storage
if (game_data['rowIndex'] != 0) {
  currentRowIndex = game_data['rowIndex'];

  // text
  for (let i = 0; i < currentRowIndex; i++) {
    let word = game_data['currentWords'][i]
    currentRowIndex = i
    for (let j in word) {
      fillTile(word[j].toLowerCase())
    }
    currentRowIndex = game_data['rowIndex'];
  }

  // color
  for (let i = 0; i < currentRowIndex; i++) {
    let evals = game_data['evaluations'][i]
    currentRowIndex = i
    currentRow.forEach((tile, i) => {
      tile.state = evals[i]
    })
    currentRowIndex = game_data['rowIndex']
  }
}
  

// Feedback state: message and shake
let message = $ref('')
let grid = $ref('')
let shakeRowIndex = $ref(-1)
let success = $ref(false)

// Keep track of revealed letters for the virtual keyboard
const letterStates: Record<string, LetterState> = $ref({})

// Handle keyboard input.
let allowInput = true

const onKeyup = (e: KeyboardEvent) => onKey(e.key)

window.addEventListener('keyup', onKeyup)

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
})

function onKey(key: string) {
  if (!allowInput) return
  if (/^[a-zA-Z]$/.test(key)) {
    fillTile(key.toLowerCase())
  } else if (key === 'Backspace') {
    clearTile()
  } else if (key === 'Enter') {
    completeRow()
  }
}

function fillTile(letter: string) {
  for (const tile of currentRow) {
    if (!tile.letter) {
      tile.letter = letter
      break
    }
  }
}

function clearTile() {
  for (const tile of [...currentRow].reverse()) {
    if (tile.letter) {
      tile.letter = ''
      break
    }
  }
}


// handling for completing a row (errors, wins, losses)
function completeRow() {

  // not enough letters
  if (!~currentRow.every((tile) => tile.letter)) {
    shake()
    showMessage('Not enough letters')
    return
  }

  // word not in word list
  const guess = currentRow.map((tile) => tile.letter).join('')
  if (!allWords.includes(guess) && guess !== answer) {
    shake()
    showMessage(`Not in word list!`)
    return
  }

  // identify correct/present/absent
  let evals = []
  const answerLetters: (string | null)[] = answer.split('')
  currentRow.forEach((tile, i) => {  // first pass: mark correct ones
    if (answerLetters[i] === tile.letter) {
      
      evals[i] = 'correct'

      tile.state = letterStates[tile.letter] = LetterState.CORRECT
      answerLetters[i] = null
    }
  })
  currentRow.forEach((tile, i) => {  // second pass: mark the present
    if (!tile.state && answerLetters.includes(tile.letter)) {
      
      evals[i] = 'present'

      tile.state = LetterState.PRESENT
      
      answerLetters[answerLetters.indexOf(tile.letter)] = null
      if (!letterStates[tile.letter]) {
        letterStates[tile.letter] = LetterState.PRESENT
      }
    }
  })
  currentRow.forEach((tile, i) => { // 3rd pass: mark absent
    if (!tile.state) {

      evals[i] = 'absent'

      tile.state = LetterState.ABSENT
      if (!letterStates[tile.letter]) {
        letterStates[tile.letter] = LetterState.ABSENT
      }
    }
  })
  
  // computing a full row
  allowInput = false
  let winState = ""
  if (currentRow.every((tile) => tile.state === LetterState.CORRECT)) {
    winState = 'WON'
  } else if (game_data['rowIndex'] < board.length - 1) {
    winState = 'IN_PROGRESS'
  } else {
    winState = 'LOST'
  }

  // push localstorage
  data[`game${row_idx}`]['currentWords'][currentRowIndex] = guess
  data[`game${row_idx}`]['evaluations'][currentRowIndex] = evals
  data[`game${row_idx}`]['gameStatus'] = winState
  data[`game${row_idx}`]['rowIndex']++

  // full row logic by cases
  switch (winState) {
    case 'WON':
      // display win msg
      setTimeout(() => {
        grid = genResultGrid()
        let response = ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Wonderful', 'Amazing', 'Awesome', 'Bravo', 'Superb', 'Spectacular', 'Sensational', 'Dazzling']
        const random = Math.floor(Math.random() * response.length);
        showMessage("You won! 😃 " + response[random] + "!", -1)
        success = true
      }, 1600)
      // go home if haven't left yet
      setTimeout(() => {
        if (getQuery('row') == row_idx) { back() }
      }, 10000)
      break

    case 'IN_PROGRESS':
      // move to next
      currentRowIndex++
      setTimeout(() => { allowInput = true }, 1600)
      break

    case 'LOST':
      // display win msg
      setTimeout(() => { showMessage("You lost! 😔 Answer: " + answer.toUpperCase(), -1) }, 1600)
      
      // add a final row, showing word that you didn't get (if incorrect)
      guesses += 1
      setTimeout(() => {
        board[guesses-1] = Array(answer.length)
        for (let i = 0; i < answer.length; i++) {
          board[guesses-1][i] = {
            letter: answer[i],
            state: LetterState.INCORRECT
          }
        }
      }, 1600)

      // add changes to localstorage
      data[`game${row_idx}`]['rowIndex']++
      data[`game${row_idx}`]['board_height']++
      data[`game${row_idx}`]['currentWords'].push(answer)
      data[`game${row_idx}`]['evaluations'].push(Array(word_length).fill("incorrect"))      
  
      // go home if haven't left yet
      setTimeout(() => {
        if (getQuery('row') == row_idx) { back() }
      }, 10000)
      break

  }

  // push changes to localstorage
  ls.set('main', data)

}

function showMessage(msg: string, time = 1000) {
  message = msg
  if (time > 0) {
    setTimeout(() => {
      message = ''
    }, time)
  }
}

function shake() {
  shakeRowIndex = currentRowIndex
  setTimeout(() => {
    shakeRowIndex = -1
  }, 1000)
}

const icons = {
  [LetterState.CORRECT]: '🟩',
  [LetterState.PRESENT]: '🟨',
  [LetterState.ABSENT]: '⬜',
  [LetterState.INITIAL]: null
}

function genResultGrid() {
  return board
    .slice(0, currentRowIndex + 1)
    .map((row) => {
      return row.map((tile) => icons[tile.state]).join('')
    })
    .join('\n')
}

function back() {
  router.go(-1)
}

</script>

<template>
  <Transition>
    <div class="message" v-if="message">
      {{ message }}
      <pre v-if="grid">{{ grid }}</pre>
    </div>
  </Transition>
  <header>
    <h1>FLITZLE</h1>

    <a
      id="back-btn"
      href="javascript:void(0);"
      @click="back"
      >Back</a
    >

  </header>
  <div id="board">
    <div
      v-for="(row, index) in board"
      :class="[
        'row',
        shakeRowIndex === index && 'shake',
        success && currentRowIndex === index && 'jump'
      ]"
    >
      <div
        v-for="(tile, index) in row"
        :class="['tile', tile.letter && 'filled', tile.state && 'revealed']"
      >
        <div class="front" :style="{ transitionDelay: `${index * 300}ms` }">
          {{ tile.letter }}
        </div>
        <div
          :class="['back', tile.state]"
          :style="{
            transitionDelay: `${index * 300}ms`,
            animationDelay: `${index * 100}ms`
          }"
        >
          {{ tile.letter }}
        </div>
      </div>
    </div>
  </div>
  <Keyboard @key="onKey" :letter-states="letterStates" />
</template>

<style scoped>
#board {
  display: grid;
  grid-template-rows: repeat(v-bind('guesses'), 1fr);
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
  --height: min(420px, calc(var(--vh, 100vh) - 310px));
  height: var(--height);
  width: min(350px, calc(var(--height) / v-bind('guesses') * v-bind('word_length')));
  margin: 0px auto;
}
.message {
  position: absolute;
  left: 50%;
  top: 80px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.85);
  padding: 16px 20px;
  z-index: 2;
  border-radius: 4px;
  transform: translateX(-50%);
  transition: opacity 0.3s ease-out;
  font-weight: 600;
}
.message.v-leave-to {
  opacity: 0;
}
.row {
  display: grid;
  grid-template-columns: repeat(v-bind('word_length'), 1fr);
  grid-gap: 5px;
}
.tile {
  width: 100%;
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  vertical-align: middle;
  text-transform: uppercase;
  user-select: none;
  position: relative;
}
.tile.filled {
  animation: zoom 0.2s;
}
.tile .front,
.tile .back {
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.tile .front {
  border: 2px solid #d3d6da;
}
.tile.filled .front {
  border-color: #999;
}
.tile .back {
  transform: rotateX(180deg);
}
.tile.revealed .front {
  transform: rotateX(180deg);
}
.tile.revealed .back {
  transform: rotateX(0deg);
}

@keyframes zoom {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(1px);
  }
  10% {
    transform: translate(-2px);
  }
  20% {
    transform: translate(2px);
  }
  30% {
    transform: translate(-2px);
  }
  40% {
    transform: translate(2px);
  }
  50% {
    transform: translate(-2px);
  }
  60% {
    transform: translate(2px);
  }
  70% {
    transform: translate(-2px);
  }
  80% {
    transform: translate(2px);
  }
  90% {
    transform: translate(-2px);
  }
  100% {
    transform: translate(1px);
  }
}

.jump .tile .back {
  animation: jump 0.5s;
}

@keyframes jump {
  0% {
    transform: translateY(0px);
  }
  20% {
    transform: translateY(5px);
  }
  60% {
    transform: translateY(-25px);
  }
  90% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(0px);
  }
}

@media (max-height: 680px) {
  .tile {
    font-size: 3vh;
  }
}
</style>
