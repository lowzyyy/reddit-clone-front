<template>
  <div class="flex w-full flex-col">
    <label for="email">Email</label>
    <input
      required
      @focus="focusHandler"
      id="email"
      type="email"
      name="email"
      class="rounded-md bg-teal-50 p-1 font-semibold outline-none"
    />
    <span class="mt-2 text-xs text-teal-200">{{ underText }}</span>
  </div>
</template>

<script setup lang="ts">
import { focusHandler } from '@/helpers/globalHelpers'
const { type } = defineProps<{ type?: 'auth' | 'reset' }>()

const underText =
  type === 'auth' || type === undefined
    ? '*this email will be used to verify the account'
    : '*you will get link to reset the password'
</script>

<style scoped></style>
