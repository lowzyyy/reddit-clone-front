<template>
  <div
    ref="menuOptionsRef"
    class="absolute left-0 z-20 flex flex-col rounded-md bg-slate-600 text-sm"
    :style="`${topPosition}`"
  >
    <span
      @click="$emit('commentEdit')"
      class="cursor-pointer rounded-t-md border-b border-slate-800 px-3 py-2 font-semibold hover:bg-slate-700"
      >Edit</span
    >
    <span
      @click="$emit('commentDelete')"
      class="cursor-pointer rounded-b-md px-3 py-2 font-semibold hover:bg-slate-700"
      >Delete</span
    >
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const { menuHeight } = defineProps<{ menuHeight: number }>()
const menuOptionsRef = ref<HTMLDivElement>()

const topPosition = ref('')
watch(menuOptionsRef, () => {
  if (menuOptionsRef.value) {
    const menuOptionsHeight = menuOptionsRef.value.getBoundingClientRect().height
    const menuOptionsBottom = menuOptionsRef.value.getBoundingClientRect().bottom
    // if menu would go outside the screen render it upside
    if (window.innerHeight - menuOptionsBottom < menuOptionsHeight)
      topPosition.value = `top:-${menuOptionsHeight + 2}px`
    // render normally
    else topPosition.value = `top:${menuHeight + 2}px`
  }
})

defineExpose({ childMenu: menuOptionsRef })
</script>

<style scoped></style>
