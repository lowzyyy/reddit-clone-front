<template>
  <div
    class="mx-auto mt-10 flex w-full flex-col gap-4 rounded-xl border border-stone-300 p-4 md:w-[600px]"
  >
    <div class="flex items-center justify-between">
      <span><PhProhibit size="35" class="text-yellow-200" /></span>
      <span class="sm :text-2xl text-center text-base font-bold"
        >THIS COMMUNITY DOES NOT EXIST</span
      >
      <span><PhProhibit size="35" class="text-yellow-200" /></span>
    </div>
    <div v-if="authStore.authenticated && !showForm">
      <span>Do you want to create one?</span>
      <button
        @click="onYeah"
        class="ml-4 rounded-lg bg-yellow-600 px-2 py-1 font-semibold transition-all hover:shadow hover:shadow-yellow-300"
      >
        Yeah!
      </button>
    </div>
    <div class="grid">
      <div class="flex flex-col">
        <div
          :class="`  ${showForm ? 'flex-1' : 'basis-0'}`"
          class="overflow-hidden transition-all duration-300"
        >
          <CreateCommunity class="w-[450px]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import CreateCommunity from '@/components/CreateCommunity/CreateCommunity.vue'
import { PhProhibit } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// state
const showForm = ref(false)

// callbacks
const onYeah = () => {
  showForm.value = true
}
</script>

<style scoped></style>
