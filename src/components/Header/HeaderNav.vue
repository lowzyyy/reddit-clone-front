<template>
  <header class="h-12 lg:h-14">
    <nav v-show="!showMobileSearch" class="relative flex items-center justify-between p-2 md:px-6">
      <div class="flex items-center gap-4">
        <RouterLink :to="{ name: 'home' }" class="flex cursor-pointer items-center gap-2">
          <PhRedditLogo size="30" weight="duotone" />
          <span class="hidden text-2xl font-bold xl:inline-block">reddit</span>
        </RouterLink>
        <div
          ref="joinedButtonRef"
          @click="
            () => {
              if (!showCommunities) refetch()
            }
          "
          v-if="authStore.authenticated"
          class="relative flex w-[120px] cursor-pointer items-center justify-between rounded-md border border-white px-2 py-1 md:w-[250px]"
        >
          <span class="text-sm lg:text-base">Community</span>
          <PhArrowDown v-if="!showCommunities" size="20" weight="fill" />
          <PhArrowUp v-else size="20" weight="fill" />
          <JoinedCommunityList
            ref="joinedResultsRef"
            v-show="showCommunities"
            :joined-community="joinedCommunities"
          />
        </div>
      </div>
      <SearchBar
        class="absolute left-[50%] hidden translate-x-[-50%] lg:flex lg:w-[300px] xl:w-[400px] 2xl:w-[500px]"
      />
      <div class="flex gap-4">
        <PhMagnifyingGlass size="24" class="lg:hidden" @click="onMagnify" />
        <div
          @click="showProfileSettings = !showProfileSettings"
          v-show="authStore.authenticated"
          class="relative flex cursor-pointer items-center gap-2"
        >
          <span
            class="flex h-6 w-6 items-center justify-center rounded-full bg-orange-300 bg-cover bg-center"
            :style="{
              backgroundImage: `url(${authStore.user.have_avatar ? avatarSource : ''} )`
            }"
            ><PhUser
              v-if="!authStore.user.have_avatar"
              size="20"
              weight="bold"
              class="text-teal-900"
          /></span>
          <span class="hidden max-w-[150px] xs:block">{{ authStore.user.username }}</span>

          <PhCaretDown v-if="!showProfileSettings" size="16" class="" />
          <PhCaretUp v-else size="16" class="" />
          <ProfileSettings v-if="showProfileSettings" v-model:image-source="avatarSource" />
        </div>
        <RouterLink
          v-if="!authStore.authenticated"
          :to="{ name: 'login' }"
          class="rounded-md bg-teal-900 p-1 transition-colors hover:bg-teal-500 md:px-2 md:py-1"
          >Sign in</RouterLink
        >
        <RouterLink
          v-if="!authStore.authenticated"
          :to="{ name: 'signup' }"
          class="rounded-md bg-teal-700 p-1 transition-colors hover:bg-teal-600 md:px-2 md:py-1"
          >Register</RouterLink
        >
      </div>
    </nav>
    <nav
      v-show="showMobileSearch"
      class="relative flex h-full items-center gap-5 pr-2 md:justify-center"
    >
      <PhArrowLeft size="25" weight="bold" @click="showMobileSearch = false" />
      <SearchBar ref="mobileSearchRef" class="relative w-full md:w-[50%]" />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import {
  PhArrowDown,
  PhArrowLeft,
  PhArrowUp,
  PhCaretDown,
  PhCaretUp,
  PhMagnifyingGlass,
  PhRedditLogo,
  PhUser
} from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/authStore'
import { useSearchStore } from '@/stores/searchStore'
// composables
import useFetchJoinedCommunities from '@/components/Composables/Header/useFetchJoinedCommunities'
// components
import JoinedCommunityList from '@/components/Header/JoinedCommunityList/JoinedCommunityList.vue'
import SearchBar from '@/components/Header/SearchBar/SearchBar.vue'
import ProfileSettings from '@/components/Header/ProfileSettings/ProfileSettings.vue'
import { BACKEND_API } from '@/helpers/globalHelpers'

const authStore = useAuthStore()
const route = useRoute()

// ref
const joinedResultsRef = ref() //exposed ref
const joinedButtonRef = ref<HTMLDivElement | null>(null)
const mobileSearchRef = ref() //exposed ref
// state
const showMobileSearch = ref(false)
const showProfileSettings = ref(false)
const avatarSource = ref(``)

const showCommunities = ref(false)
const { data: joinedCommunities, refetch } = useFetchJoinedCommunities()

const authenticatedToken = computed(() => authStore.user.token)
watch(authenticatedToken, () => {
  avatarSource.value = `${BACKEND_API}/users/${authStore.user.id}`
})
watch(route, () => (showMobileSearch.value = false))

const onOutsideClickJoined = (e: any) => {
  if (
    !joinedResultsRef.value?.results.contains(e.target) &&
    !joinedButtonRef.value?.contains(e.target)
  )
    showCommunities.value = false
  else {
    showCommunities.value = !showCommunities.value
  }
}

const onMagnify = () => {
  showMobileSearch.value = true
  setTimeout(() => console.log(mobileSearchRef.value.ref.focus()), 500)
}

onMounted(() => document.addEventListener('click', onOutsideClickJoined))
onUnmounted(() => document.removeEventListener('click', onOutsideClickJoined))
</script>

<style scoped></style>
