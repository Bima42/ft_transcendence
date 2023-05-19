import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'

import '@/assets/main.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
	faCheck, faXmark, faPencil, faQuestion, faPaperPlane, faChevronLeft,
	faBars, faUser, faArrowRightFromBracket, faArrowUpFromBracket, faEllipsis,
	faComments, faChevronRight, faGamepad, faUserFriends, faRankingStar, faPlus,
	faLock, faCrown, faUserAstronaut, faVolumeXmark, faBan, faMagnifyingGlass

} from '@fortawesome/free-solid-svg-icons'

library.add(
	faCheck, faXmark, faPencil, faQuestion, faPaperPlane, faChevronLeft,
	faBars, faUser, faArrowRightFromBracket, faArrowUpFromBracket, faEllipsis,
	faComments, faChevronRight, faGamepad, faUserFriends, faRankingStar, faPlus,
	faLock, faCrown, faUserAstronaut, faVolumeXmark, faBan, faMagnifyingGlass
)

const pinia = createPinia()
pinia.use(({ store }) => {store.router = markRaw(router) })

createApp(App)
	.component('font-awesome-icon', FontAwesomeIcon)
	.use(pinia)
	.use(router)
	.mount('#app')
