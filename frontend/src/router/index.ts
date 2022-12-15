import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import LoginView from '@/views/LoginView.vue'
import CreditsView from '@/views/CreditsView.vue'
import LiveGameView from '@/views/LiveGameView.vue'
import PlayAGameView from '@/views/PlayAGameView.vue'
import ScoreBoardView from '@/views/ScoreBoardView.vue'
import CommunityView from '@/views/CommunityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView,
    },
    {
      path: '/index',
      name: 'index',
      component: IndexView,
    },
    {
      path: '/credits',
      name: 'credits',
      component: CreditsView,
    },
    {
      path: '/live',
      name: 'live',
      component: LiveGameView,
    },
    {
      path: '/play',
      name: 'play',
      component: PlayAGameView,
    },
    {
      path: '/score',
      name: 'score',
      component: ScoreBoardView,
    },
    {
      path: '/community',
      name: 'community',
      component: CommunityView,
    },
  ]
})

export default router
