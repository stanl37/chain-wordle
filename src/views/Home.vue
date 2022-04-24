<script setup lang="ts">
import { getAnswerArray } from '../query'
import { LetterState } from '../types'
import router from '../router/router'

// "will you go to formal with me"
// 6RR3MbFXByBuyusNuRoseNu34tkpvDXqz3XhCCDi
const msgArray = getAnswerArray()
if (msgArray == null) {
  router.push("/landing")
} else {
  // Board state. Each tile is represented as { letter, state }
  let board = []
  for (let i = 0; i < msgArray.length; i++) {
    board[i] = Array.from({ length: msgArray[i].length }, () => ({ letter: '', state: LetterState.INITIAL }))
  }
}

</script>

<template>
  <div>Home!</div>

  <div class="message" v-if="msgArray">
      {{ msgArray }}
    </div>

  

  <RouterLink to="/game?asdf=CDkCVNC">game</RouterLink>
</template>