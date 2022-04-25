<script setup lang="ts">
import bs58 from 'bs58'

let message = $ref("earth the blue marble")
const b58 = $computed(() => bs58.encode(new TextEncoder().encode(message)))
let url = $computed(() => location.origin + "/?s=" + b58)

</script>

<template>
<body>
  <input v-model="message">
  <br>
  <p>Link:</p>
  <a :href="url">{{ url }}</a>

</body>
</template>