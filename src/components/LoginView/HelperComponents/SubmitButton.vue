<template>
  <button
    type="submit"
    class="mt-3 flex rounded-md bg-sky-600 p-3 py-2 transition-colors hover:bg-sky-500 disabled:bg-gray-500"
  >
    <span v-if="!isProcessing" class="font-bold">{{ buttonText }}</span>
    <SpinnerStatus v-else class="fill-white text-center text-green-500" />
  </button>
</template>

<script setup lang="ts">
import SpinnerStatus from '@/components/Spinner/SpinnerStatus.vue'

defineProps<{ isProcessing: boolean; buttonText: string }>()
</script>

<style scoped></style>
