import { createRouter } from 'vue-router'

import Login from '@/views/Login.vue'

const router = createRouter({
    routes: [
        {
            path: '/',
            component: Login,
        }
    ]
})

export default router;