<script setup lang="ts">
import { getAnswer, getQuery } from '../query'
import router from '../router/router'
import { utils } from '../utils/gameutils';
import ls from '../router/localStore'

// MANUALLY SET HOW MANY GUESSES AVAILABLE PER GAME
// default: 6
let guesses = 6;

// Store b58 string
let b58 = getQuery('s')
let old_b58 = ls.get('b58')
if (old_b58 != b58) {
  resetGame(false)
  ls.set('b58', b58)
}

// Get info from sentence string
const [num_words, max_word_length, msgArray] = utils.parseSentence(getAnswer())

// Local storage of board
utils.storeMainBoard(guesses, num_words, max_word_length, msgArray)
console.log("Main board saved in local storage.")

// Create main board
let board = utils.createMainBoardObject()
console.log("Main board object created: ", msgArray)

// On click
function clickHandler(row_idx:number) {
  let route = { name: 'game', query : { row: row_idx } }
  router.push(route)
  console.log("Routing:", route)
}

// Function for main page hover animations
function getClass(row_idx:number) {
  const currentRow = board[row_idx]
  const state = currentRow[0]["state"]
  if (state != 'hidden') {
    return ['row']
  } else {
    return ['row', 'grow']
  }
}

// reset
function resetGame(wantConfirm:boolean) {
  if (wantConfirm && !confirm('Are you sure?')) {
    return
    }
  console.log("Resetting local storage...")
  ls.clear()  // resetting local storage
  location.reload()
}


</script>

<template>
  <header>
    <h1>FLITZLE</h1>
    
    <a
      id="source-link"
      href="https://github.com/stanl37/chain-wordle"
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
    <a @click="resetGame(true)">reset</a>
</footer>
</template>

<style scoped>
#board {
  display: grid;
  grid-template-rows: repeat(v-bind('num_words'), 1fr);
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
  --height: min(420px, calc(var(--vh, 100vh) - 310px));
  height: var(--height);
  width: min(350px, calc(var(--height) / v-bind('num_words') * v-bind('max_word_length')));
  margin: 0px auto;
}

.row {
  display: grid;
  grid-template-columns: repeat(v-bind('max_word_length'), 1fr);
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