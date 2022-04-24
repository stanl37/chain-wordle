import { createRouter, createWebHistory } from 'vue-router'

import Home from "../views/Home.vue"
import Game from "../views/Game.vue"
import Landing from "../views/Landing.vue"
import About from "../views/About.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [

    { path: '/', name: 'home', component: Home },
    { path: '/game', name: 'game', component: Game },

    { path: '/about', name: 'about', component: About },

    { path: '/landing', name: 'landing', component: Landing },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: Landing },
    { path: '/:pathMatch(.*)', name: 'bad-not-found', component: Landing },

    
    
  ]
})

export default router
