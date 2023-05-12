import { createRouter, createWebHistory } from 'vue-router'
import CreditsView from '@/views/CreditsView.vue'
import PlayAGameView from '@/views/PlayAGameView.vue'
import RedirectHandler from '@/components/RedirectHandler.vue'
import LoginView from '@/views/LoginView.vue'
import IndexView from '@/views/IndexView.vue'
import ProfileView from '@/views/ProfileView.vue';
import CommunityView from '@/views/CommunityView.vue';
import { useUserStore } from '@/stores/user'
import TwoFaView from '@/views/TwoFaView.vue';
import FriendsView from '@/views/FriendsView.vue';
import LeaderboardView from '@/views/LeaderboardView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'landing page',
            component: LoginView,
        },
        {
            path: '/redirect/:target',
            name: 'redirectHandler',
            component: RedirectHandler,
        },
        {
            path: '/2fa',
            name: '2fa',
            component: TwoFaView,
        },
        {
            path: '/credits',
            name: 'credits',
            component: CreditsView,
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
                    path: 'community',
                    name: 'community',
                    component: CommunityView,
                    longName: 'Community',
                },
                {
                    path: 'friends',
                    name: 'friends',
                    component: FriendsView,
                },
                {
                    path: 'leaderboard',
                    name: 'leaderboard',
                    component: LeaderboardView,
                },
                {
                    path: 'index',
                    name: 'index',
                    component: IndexView,
                },
                {
                    path: 'profile/:id?',
                    name: 'profile',
                    component: ProfileView,
                },
            ]
        }
    ]
})

router.beforeEach((to, _from) => {
  const userStore = useUserStore();

  if ( to.path.startsWith('/main') && !userStore.isLoggedIn()) {
    userStore.resetState()
    return '/';
  }
  if ( to.path == '/' && userStore.isLoggedIn()) {
    return '/main/index';
  }
});

export default router
