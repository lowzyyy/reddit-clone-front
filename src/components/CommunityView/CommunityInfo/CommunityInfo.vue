<template>
  <div class="w-[300px] rounded-md border border-teal-800 bg-teal-950 px-4 py-3 text-base">
    <div v-if="data" class="flex h-full flex-col">
      <div class="">
        <h2 class="border-b border-slate-500 text-base">About community</h2>
        <p class="mt-3 max-h-[350px] overflow-y-auto">{{ data.description }}</p>
      </div>
      <div class="mt-7 flex items-center gap-2 text-center text-xl">
        <PhUsersThree weight="fill" size="25" class="text-slate-300" /> {{ data.members }} members
      </div>
      <div class="mt-7 border-t border-slate-500 pt-2">
        <span class="flex items-center gap-2" title="Create date of the community.">
          <PhCake size="20" />
          {{
            new Date(data.createdAt).toLocaleString(undefined, {
              month: 'numeric',
              year: 'numeric',
              day: 'numeric'
            })
          }}
        </span>
        <span
          class="flex items-center gap-2"
          :title="`${
            data.visibility
              ? 'Community is visible to anyone.'
              : 'Community is visible only to creator.'
          }`"
        >
          <PhEye :size="20" /> {{ data.visibility ? 'Public' : 'Private' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TCommunity } from '@/components/Composables/CommunityViewComp/useFetchCommunityData'
import { PhCake, PhEye, PhUsersThree } from '@phosphor-icons/vue'
const { data } = defineProps<{ data: TCommunity | undefined }>()
</script>

<style scoped></style>
