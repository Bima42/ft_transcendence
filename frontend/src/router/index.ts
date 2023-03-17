import {createRouter, createWebHistory} from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import LoginView from '@/views/LoginView.vue'
import CreditsView from '@/views/CreditsView.vue'
import PlayAGameView from '@/views/PlayAGameView.vue'
import ScoreBoardView from '@/views/ScoreBoardView.vue'
import CommunityView from '@/views/CommunityView.vue'
import TableView from '@/components/table/TheTable.vue'
import JoinQueueView from '@/views/JoinQueue.vue'
import redirectHandler from '@/components/redirectHandler.vue';
import { useAuthStore } from '@/stores/auth'

function skipIfLoggedIn(to, from, next) {
  const authStore = useAuthStore();

  if (authStore.isLoggedIn()) {
    next();
  } else {
      next({name: '/index' });
  }
}

function requireAuth(to, from, next) {
    const authStore = useAuthStore();

    if (authStore.isLoggedIn()) {
        next()
    } else {
      next({ name: '' })
    }
  }

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: LoginView,
            beforeEnter: skipIfLoggedIn,
        },
        {
            path: '/index',
            name: 'index',
            component: IndexView,
            beforeEnter: requireAuth,
        },
        {
            path: '/credits',
            name: 'credits',
            component: CreditsView,
            beforeEnter: requireAuth,
        },
        {
            path: '/table',
            name: 'table',
            component: TableView,
            beforeEnter: requireAuth,
        },
        {
            path: '/main',
            name: 'main',
            children: [
                // {
                //    path: 'play',
                //    name: 'play',
                //    component: PlayAGameView,
                //    beforeEnter: requireAuth,
                //    longName: 'Play a game',
                // },
                 {
                    path: 'play',
                    name: 'play',
                    component: JoinQueueView,
                    beforeEnter: requireAuth,
                    longName: 'Play a game',
                 },
                {
                    path: 'score',
                    name: 'score',
                    component: ScoreBoardView,
                    beforeEnter: requireAuth,
                    longName: 'Scoreboard',
                },
                {
                    path: 'community',
                    name: 'community',
                    component: CommunityView,
                    beforeEnter: requireAuth,
                    longName: 'Community',
                },
            ]
        },
        {
            path: '/redirectHandler',
            name: 'redirectHandler',
            component: redirectHandler,
        }
    ]
})

export default router
