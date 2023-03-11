<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const userStore = useAuthStore()

userStore.login()
</script>
