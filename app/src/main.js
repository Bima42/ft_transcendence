import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import router from '@/router/router.ts'
app.use(router)

app.mount('#app')
