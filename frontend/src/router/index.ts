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
            path: '/table',
            name: 'table',
            component: TableView,
        },
        {
            path: '/main',
            name: 'main',
            children: [
                // TODO: remove from main menu
                {
                   path: 'game',
                   name: 'game',
                   component: PlayAGameView,
                },
                {
                    path: 'play',
                    name: 'play',
                    component: JoinQueueView,
                    longName: 'Join queue',
                },
                {
                    path: 'score',
                    name: 'score',
                    component: ScoreBoardView,
                    longName: 'Scoreboard',
                },
                {
                    path: 'community',
                    name: 'community',
                    component: CommunityView,
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

router.beforeEach((to, _from) => {
  const authStore = useAuthStore();

  if ( to.path.startsWith("/main") && ! authStore.isLoggedIn()) {
    return '/';
  }
  if ( to.path == '/' && authStore.isLoggedIn()) {
    return '/index';
  }
});

export default router
