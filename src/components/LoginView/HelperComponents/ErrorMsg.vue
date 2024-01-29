<template>
  <p
    v-if="errorMsg.length"
    class="text-center text-sm font-semibold text-red-400"
    :class="`message`"
  >
    {{ errorMsg }}
  </p>
</template>

<script setup lang="ts">
defineProps<{ errorMsg: string }>()
</script>

<style scoped></style>
