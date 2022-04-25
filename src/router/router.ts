import { createRouter, createWebHistory } from 'vue-router'

import Home from "../views/Home.vue"
import Game from "../views/Game.vue"
import Landing from "../views/Landing.vue"
import About from "../views/About.vue"
import Redirect from "../views/Redirect.vue"
import Encode from "../views/Encode.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [

    { path: '/', name: 'home', component: Home },
    { path: '/game', name: 'game', component: Game },

    { path: '/monique', name: 'monique', component: Redirect },

    { path: '/about', name: 'about', component: About },
    { path: '/encode', name: 'encode', component: Encode },

    { path: '/landing', name: 'landing', component: Landing },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: Landing },
    { path: '/:pathMatch(.*)', name: 'bad-not-found', component: Landing },

    
    
  ]
})

export default router
