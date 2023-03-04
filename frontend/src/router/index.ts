import {createRouter, createWebHistory} from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import LoginView from '@/views/LoginView.vue'
import CreditsView from '@/views/CreditsView.vue'
import PlayAGameView from '@/views/PlayAGameView.vue'
import ScoreBoardView from '@/views/ScoreBoardView.vue'
import CommunityView from '@/views/CommunityView.vue'
import TableView from '@/components/table/TheTable.vue'

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
            component: TableView
        },
        {
            path: '/main',
            name: 'main',
            children: [
                {
                    path: 'play',
                    name: 'play',
                    component: PlayAGameView,
                    longName: 'Play a game',

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
    ]
})

export default router
