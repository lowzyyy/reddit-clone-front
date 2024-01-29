<template>
  <li class="mb-0 cursor-pointer rounded-md last:mb-0 hover:bg-green-950">
    <RouterLink
      :to="{ name: 'communityview', params: { communityName: result.name } }"
      class="flex items-center gap-2 p-2"
    >
      <PhGlobeSimple size="28" weight="light" />
      <div class="flex flex-col">
        <span class="text-sm">r/{{ result.name }}</span>
        <span v-if="result.members" class="text-xs"
          >{{ result.members + (result.members === 1 ? ' member' : ' members') }}
        </span>
      </div>
    </RouterLink>
  </li>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { PhGlobeSimple } from '@phosphor-icons/vue'
import type { TCommunity } from '@/components/Composables/CommunityViewComp/useFetchCommunityData'
defineProps<{ result: TCommunity }>()
</script>

<style scoped></style>
