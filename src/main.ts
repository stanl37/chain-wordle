import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.ts'
import Storage from 'vue-ls';

// resize for scaling the board size
window.addEventListener('resize', onResize)
// set size on startup
onResize()

function onResize() {
  // get actual vh on mobile
  document.body.style.setProperty('--vh', window.innerHeight + 'px')
}

const app = createApp(App)
app.use(router)
app.use(Storage, {storage: 'local' })
app.mount("#app")