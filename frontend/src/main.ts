import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'

import '@/assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
	faCheck, faXmark, faPencil, faQuestion, faPaperPlane, faChevronLeft,
	faBars, faUser, faArrowRightFromBracket, faArrowUpFromBracket, faEllipsis,
	faComments
} from '@fortawesome/free-solid-svg-icons'

library.add(
	faCheck, faXmark, faPencil, faQuestion, faPaperPlane, faChevronLeft,
	faBars, faUser, faArrowRightFromBracket, faArrowUpFromBracket, faEllipsis,
	faComments)

createApp(App)
	.component('font-awesome-icon', FontAwesomeIcon)
	.use(createPinia())
	.use(router)
	.mount('#app')
