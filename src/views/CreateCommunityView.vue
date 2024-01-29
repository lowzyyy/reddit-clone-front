<template>
  <div
    class="mx-auto mt-20 flex w-[98%] flex-col items-center gap-4 rounded-xl border border-stone-300 p-6 sm:w-[500px] lg:mt-10"
  >
    <CreateCommunity class="w-full"> </CreateCommunity>
  </div>
</template>

<script setup lang="ts">
import CreateCommunity from '@/components/CreateCommunity/CreateCommunity.vue'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {
  const authStore = useAuthStore()
  const router = useRouter()
  if (!authStore.authenticated) router.push({ name: 'home' })
})
</script>

<style scoped></style>
