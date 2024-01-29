<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import HeaderNav from '@/components/Header/HeaderNav.vue'
import SpinnerStatus from './components/Spinner/SpinnerStatus.vue'
import { BACKEND_API } from './helpers/globalHelpers'
import { setLoginState } from '@/components/LoginView/helpers'
const authStore = useAuthStore()

onBeforeMount(async () => {
  const router = useRouter()

  authStore.isInitialLoad = false
  const authStorage = localStorage.getItem('redditAuth')
  try {
    if (authStorage) {
      const authStorageParsed = JSON.parse(authStorage)
      if (authStorageParsed.expiresIn >= new Date().getTime()) {
        const { data } = await axios.post(
          `${BACKEND_API}/login`,
          { rememberMe: authStorageParsed.rememberMe },
          {
            headers: {
              Authorization: 'Bearer ' + `${authStorageParsed.token}`
            }
          }
        )
        setLoginState(data, authStorageParsed.rememberMe)
      }
    }

    authStore.isLoggingIn.value = false
  } catch (error: any) {
    authStore.isLoggingIn.value = false
    if (error instanceof AxiosError) {
      authStore.clearState()
      router.push({ name: 'login' })
    }
  }
})
</script>

<template>
  <div class="relative z-30 bg-teal-950 px-2 md:px-5 xl:p-1">
    <HeaderNav />
  </div>
  <RouterView v-if="!authStore.isInitialLoad" />
  <div v-else class="flex h-full items-center justify-center bg-slate-500">
    <SpinnerStatus class="h-28 w-28 fill-green-800" />
  </div>
</template>

<style scoped></style>
