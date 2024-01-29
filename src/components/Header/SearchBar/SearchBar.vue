<template>
  <div class="z-50 flex items-center text-sm">
    <PhMagnifyingGlass size="20" class="pointer-events-none absolute left-2" />
    <input
      @input="onSearchInput"
      autocomplete="off"
      ref="searchBarRef"
      v-model="searchStore.searchPhrase"
      type="text"
      placeholder="Search Reddit"
      class="w-full cursor-pointer rounded-3xl border border-teal-700 bg-teal-900 py-2 pl-9 pr-3 outline-none transition-colors hover:border-white hover:bg-slate-950"
    />
    <SearchResults
      ref="searchResultRef"
      :searchResult="searchResult"
      :showSearchResult="showSearchResult"
      :isFinishedFetch="isFinishedFetch"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import SearchResults from './SearchResults.vue'

import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import { useSearchStore } from '@/stores/searchStore'
import type { TCommunity } from '@/components/Composables/CommunityViewComp/useFetchCommunityData'

const searchStore = useSearchStore()

// refs
const searchBarRef = ref<null | HTMLInputElement>(null)
const searchResultRef = ref() //exposed ref
// state

const isFinishedFetch = ref<boolean>(false)
const searchResult = ref<TCommunity[]>([])
const debounceTimer = ref<undefined | number>(undefined)
const showSearchResult = ref(false)

// close search results when clicked outside of search or the result
const onOutsideClick = (e: any) => {
  if (!searchBarRef.value!.contains(e.target) && !searchResultRef.value.results.contains(e.target))
    showSearchResult.value = false
  else showSearchResult.value = true
}
onMounted(() => document.addEventListener('click', onOutsideClick))
onUnmounted(() => document.removeEventListener('click', onOutsideClick))

const route = useRoute()
const routeCommunity = computed(() => route.params.communityName)
watch(routeCommunity, () => {
  searchResult.value = []
  searchStore.searchPhrase = ''
})

// handlers
const authStore = useAuthStore()
const router = useRouter()
const onSearchInput = async () => {
  searchResult.value = []
  isFinishedFetch.value = false
  clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(async () => {
    if (searchStore.searchPhrase.length < 3) {
      isFinishedFetch.value = true
      return
    }
    await checkAuthOrRedirect(router)
    axios
      .get<{ data: TCommunity[] }>(
        `${BACKEND_API}/communities?term=${searchStore.searchPhrase.toLowerCase()}`,
        {
          headers: {
            Authorization: 'Bearer ' + `${authStore.user.token}`
          }
        }
      )
      .then((response) => {
        searchResult.value = response.data.data
        isFinishedFetch.value = true
      })
      .catch((error) => {
        console.log(error)
      })
  }, 500)
}

defineExpose({ ref: searchBarRef })
</script>

<style scoped></style>
