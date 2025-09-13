<template>
  <div class="tw:p-4">
    <h2 class="tw:mb-4 tw:text-xl">Dashboard</h2>
    <p v-if="user">Welcome, {{ user.name }}</p>
    <a-button @click="logout">Logout</a-button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

defineOptions({ name: 'DashboardPage' })

const auth = useAuthStore()
const router = useRouter()
const user = auth.user

function logout() {
  auth.logout(router)
}
</script>
