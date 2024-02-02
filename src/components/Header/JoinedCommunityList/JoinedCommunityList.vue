<template>
  <div
    ref="results"
    class="absolute left-0 top-10 flex w-full flex-col rounded-md border border-teal-500 bg-teal-700 xs:border-teal-600"
  >
    <p v-if="!joinedCommunity" class="flex justify-center p-2 text-center">
      <SpinnerStatus class="fill-teal-500" />
    </p>
    <p v-else-if="joinedCommunity && joinedCommunity.length === 0" class="p-2 text-sm">
      No joined communities!
    </p>
    <RouterLink
      v-else
      v-for="(community, index) in joinedCommunity"
      :to="{ name: 'communityview', params: { communityName: community } }"
      :key="index"
      class="border-b border-teal-100 py-3 first:rounded-t-md last:border-none hover:bg-teal-900"
    >
      <span class="mx-2 block overflow-hidden text-xs xs:text-sm md:px-2">
        {{ community }}
      </span>
    </RouterLink>
    <RouterLink
      :to="{ name: 'createCommunity' }"
      class="flex items-center gap-2 p-2 text-sm last:rounded-b-md hover:bg-slate-800 lg:text-base"
      ><PhPlus size="22" weight="bold" /> Create community
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import SpinnerStatus from '@/components/Spinner/SpinnerStatus.vue'
import { PhPlus } from '@phosphor-icons/vue'
import { ref } from 'vue'

defineProps<{ joinedCommunity: string[] | undefined }>()

const results = ref<HTMLDivElement | null>(null)

defineExpose({ results })
</script>

<style scoped></style>
