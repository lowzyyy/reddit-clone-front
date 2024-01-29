<template>
  <div class="flex gap-1 text-sm">
    <input
      @click="
        (e: any) =>
          e.target.checked ? $emit('update:remember', true) : $emit('update:remember', false)
      "
      type="checkbox"
      id="remember"
      name="rememberMe"
      value="true"
      class="cursor-pointer"
    />
    <label for="remember" class="cursor-pointer">Remember Me</label>
  </div>
</template>

<script setup lang="ts">
defineProps<{ remember: boolean }>()
defineEmits(['update:remember'])
</script>

<style scoped></style>
