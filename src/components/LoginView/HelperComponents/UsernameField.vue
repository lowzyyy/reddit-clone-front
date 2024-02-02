<template>
  <div class="flex w-full flex-col">
    <label for="username">Username</label>
    <input
      required
      @focus="focusHandler"
      type="text"
      id="username"
      name="username"
      minlength="3"
      maxlength="12"
      class="rounded-md bg-teal-50 p-1 font-semibold text-black outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { focusHandler } from '@/helpers/globalHelpers'
</script>

<style scoped></style>
