<template>
  <div class="flex w-full flex-col">
    <label for="password">{{ labelText ?? 'Password' }}</label>
    <input
      required
      ref="inputRef"
      @focus="focusHandler"
      type="password"
      :id="id"
      :name="id"
      minlength="6"
      class="rounded-md bg-teal-50 p-1 font-semibold text-black outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { focusHandler } from '@/helpers/globalHelpers'
import { ref } from 'vue'

defineProps<{ labelText?: string; id: string }>()

const inputRef = ref<HTMLInputElement>()

defineExpose({ inputRef })
</script>

<style scoped></style>
