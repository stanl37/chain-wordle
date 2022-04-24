<script setup lang="ts">
import { getAnswer } from '../query'
import { LetterState } from '../types'

// "will you go to formal with me"
// 6RR3MbFXByBuyusNuRoseNu34tkpvDXqz3XhCCDi
const message = getAnswer()!
const msgArray = message.split(" ");

// Board state. Each tile is represented as { letter, state }
let board_temp:{[key: string]: string }[][]
board_temp = []
for (let i = 0; i < msgArray.length; i++) {
  board_temp[i] = Array.from({ length: msgArray[i].length }, () => ({ letter: '', state: LetterState.INITIAL }))
}
const board = board_temp



</script>

<template>

  <div class="message" v-if="message">
      {{ msgArray }}
    </div>

  <div>page 1!!!</div>

  <router-link to="/game?asdf=CDkCVNC">game</router-link>
</template>