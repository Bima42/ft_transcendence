import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/LoginView.vue'
import Index from '@/views/IndexView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Login,
        },
        {
            path: '/index',
            component: Index,
        }
    ]
})

export default router;