<script setup lang="ts">
import { getAnswerArray } from '../query'
import { LetterState } from '../types'
import router from '../router/router'
import ls from '../router/localStore'

// MANUALLY SET HOW MANY GUESSES AVAILABLE FOR EACH GAME!
let guesses = 6;

// get list of words
const msgArray = getAnswerArray()!
if (msgArray == null) { window.location.href = '/landing'; }
console.log("msgArray:", msgArray)
const num_words = msgArray.length

// get longest word
function findLongestWord(msgArray: string[]) {
  var longestWord = [...msgArray].sort(function(a, b) { return b.length - a.length; });
  return longestWord[0].length;
}
const longestWord = findLongestWord(msgArray);

// game template
let game_template = {
  solution: "steve",
  gameStatus: "IN_PROGRESS",
  rowIndex: 0,
  board_height: 0,
  board_length: 0,
  currentWords: null,
  evaluations: null,
}

// localStorage of board
let existing = ls.get('main');
console.log(existing)
if (!existing) {
  let main_dict = {}
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

// TODO: stopped here

// generate board
let board = $ref(
  Array.from({ length: msgArray.length }, () =>
    Array.from({ length: longestWord }, () => ({
      letter: '',
      state: LetterState.INITIAL
    }))
  )
)

// update board based on storage
const states = {
  "won": LetterState.CORRECT,
  "lost": LetterState.INCORRECT,
  "incomplete": LetterState.HIDDEN
}
for (let i = 0; i < msgArray.length; i++) {
  const currentRow = board[i]
  const currentWord = msgArray[i]
  let rowState = JSON.parse(localStorage.getItem(`row${i}`))["state"]
  console.log(rowState)
  for (let j = 0; j < currentWord.length; j++) {
    currentRow[j].letter = currentWord[j]
    currentRow[j].state = states[rowState]
  }
}

// on click
function clickHandler(row_idx) {
  // check if click allowed
  const currentRow = board[row_idx]
  const state = currentRow[0]["state"]
  if (state != 'hidden') { return }
  // proceed
  let route = { name: 'game', query : { row: row_idx } }
  console.log(route)
  router.push(route)
}

// grid size dict, for <style> section
let gameGrid = {
  guesses: msgArray.length,
  word_length: longestWord
}

function getClass(row_idx) {
  const currentRow = board[row_idx]
  const state = currentRow[0]["state"]
  console.log("yeet", state)
  if (state != 'hidden') {
    return ['row']
  } else {
    return ['row', 'grow']
  }
}

function resetGame() {
  if (!confirm('Are you sure?')) { return }
  console.log("resetting")

  // resetting local storage
  for (var i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i)
    console.log(key)
    let row_data = JSON.parse(localStorage.getItem(key))
    row_data["state"] = "incomplete"
    localStorage.setItem(key, JSON.stringify(row_data));
  }

  // resetting letter states
  for (let i = 0; i < msgArray.length; i++) {
    const currentRow = board[i]
    const currentWord = msgArray[i]
    for (let j = 0; j < currentWord.length; j++) {
      currentRow[j].state = LetterState.HIDDEN
  }
  }
}

</script>

<template>
  <header>
    <h1>FLITZLE</h1>
    
    <a
      id="source-link"
      href="https://github.com/yyx990803/vue-wordle"
      target="_blank"
      >Source</a
    >
  </header>
  <div id="board">
    <div
      v-for="(row, index) in board"
      :class="getClass(index)"
      :id=index
      @click="clickHandler(index)"
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
  <br>
  <footer>
    <a @click="resetGame">reset</a>
</footer>
</template>

<style scoped>
#board {
  display: grid;
  grid-template-rows: repeat(v-bind('gameGrid.guesses'), 1fr);
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
  --height: min(420px, calc(var(--vh, 100vh) - 310px));
  height: var(--height);
  width: min(350px, calc(var(--height) / v-bind('gameGrid.guesses') * v-bind('gameGrid.word_length')));
  margin: 0px auto;
}

.row {
  display: grid;
  grid-template-columns: repeat(v-bind('gameGrid.word_length'), 1fr);
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