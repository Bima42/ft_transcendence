<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// This function can be used later for any redirect
function redirectUser() {
	if (route.params.target === 'login') {
		userStore.login().then((res) => {
			if (res)
				router.push('/main/index')
			else
				return
		})
	}
}

redirectUser();
</script>
