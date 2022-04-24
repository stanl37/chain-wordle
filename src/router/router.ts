import { createRouter, createWebHistory } from 'vue-router'

import Page1 from "../views/Page1.vue"
import Game from "../views/Game.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Page1
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    }
  ]
})

export default router
