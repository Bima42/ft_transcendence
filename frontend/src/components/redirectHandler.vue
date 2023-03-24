<script setup lang="ts">
import { useUserStore } from '@/stores/auth';

const userStore = useUserStore()

userStore.login()
</script>
