<template>
  <form
    @submit="onSubmit"
    method="post"
    autocomplete="off"
    class="flex flex-col items-center gap-6 [&>*>input]:text-black"
  >
    <slot />
  </form>
</template>

<script setup lang="ts">
defineProps<{ onSubmit: (e: any) => void }>()
</script>

<style scoped></style>
