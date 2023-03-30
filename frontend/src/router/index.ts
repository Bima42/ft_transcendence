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
import { useUserStore } from '@/stores/user'
import TwoFaView from '@/views/TwoFaView.vue';

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
        },
        {
            path: '/2fa',
            name: '2fa',
            component: TwoFaView,
        }
    ]
})

router.beforeEach((to, _from) => {
  const userStore = useUserStore();

  if ( to.path.startsWith("/main") && ! userStore.isLoggedIn()) {
    userStore.user = null;
    localStorage.removeItem('localUser');
    return '/';
  }
  if ( to.path == '/' && userStore.isLoggedIn()) {
    return '/index';
  }
});

export default router
