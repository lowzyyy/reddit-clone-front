<template>
  <div
    ref="results"
    v-show="inputLength > 0 && showSearchResult && isFinishedFetch"
    class="absolute top-11 w-full rounded-md border border-emerald-700 bg-emerald-900 p-2 md:top-12"
  >
    <ul v-if="searchResult.length > 0 && inputLength > 2">
      <CommunityItem
        v-for="(result, index) in searchResult"
        :result="result"
        :key="index"
      ></CommunityItem>
    </ul>
    <p v-else-if="inputLength > 0 && inputLength < 3" class="text-sm">
      Type at least 3 characters...
    </p>
    <p v-else-if="!searchResult.length && inputLength > 2" class="text-sm">No results found!</p>
  </div>
</template>

<script setup lang="ts">
import CommunityItem from './CommunityItem.vue'
import { computed, ref } from 'vue'
import { useSearchStore } from '@/stores/searchStore'
import type { TCommunity } from '@/components/Composables/CommunityViewComp/useFetchCommunityData'

const searchStore = useSearchStore()
const inputLength = computed(() => searchStore.searchPhrase.length)

const results = ref<HTMLDivElement | null>(null)
defineProps<{
  searchResult: TCommunity[]
  showSearchResult: boolean
  isFinishedFetch: boolean
}>()

defineExpose({ results })
</script>

<style scoped></style>
