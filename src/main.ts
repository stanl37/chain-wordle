import { createApp } from 'vue'
import Vue3Storage, { StorageType } from "vue3-storage";
import App from './App.vue'
import router from './router/router.ts'

// resize for scaling the board size
window.addEventListener('resize', onResize)
// set size on startup
onResize()

function onResize() {
  // get actual vh on mobile
  document.body.style.setProperty('--vh', window.innerHeight + 'px')
}

const app = createApp(App);
app.use(router);
app.use(Vue3Storage, { namespace: "pro_", storage: StorageType.Local })
app.mount("#app");