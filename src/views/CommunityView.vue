<template>
  <div v-if="data === undefined">
    <div class="mx-auto mt-10 flex w-full items-center justify-center md:w-[600px]">
      <SpinnerStatus class="h-24 w-24 fill-teal-700" />
    </div>
  </div>
  <NotExistCommunity v-if="data && data.message === 'Community does not exist!'" />
  <PrivateCommunity v-if="data && data.message === 'Community is private!'" />
  <CreatePost
    v-if="showCreatePost && data?.data"
    @modal-clicked="onCreatePostModal"
    :name="data?.data?.name"
    :refetch="refetchPosts"
  />
  <div
    v-if="data && data.data"
    class="relative left-0 z-20 flex w-full flex-col items-center justify-center bg-cyan-700 bg-cover"
    :style="{
      height: `${isMobile ? parseInt(bannerHeight) / 2 + 'px' : `${bannerHeight}`}`,
      backgroundImage: `url(${isUploadingBanner ? '' : `${bannerSource}`})`,
      backgroundPosition: `center ${bannerPositionY}%`
    }"
  >
    <SpinnerStatus v-if="isUploadingBanner" class="fill-green-600 sm:h-9 sm:w-9" />
    <span
      @click="showEditBanner = !showEditBanner"
      v-if="data.isOwner"
      class="absolute right-0 top-0 flex h-full cursor-pointer items-center bg-green-600 p-2 opacity-70 hover:opacity-100"
    >
      <PhPencil size="24" class="" />
    </span>
    <EditBanner
      v-if="showEditBanner"
      v-model:image-source="bannerSource"
      v-model:image-position="bannerPositionY"
      v-model:is-uploading="isUploadingBanner"
      :current-banner-size="data.data.bannerHeight"
      @modal-clicked="
        () => {
          showEditBanner = false
        }
      "
      @set-banner-height="(value) => (bannerHeight = value)"
    />
  </div>
  <div
    v-if="data && data.data"
    class="relative z-10 w-full border-t border-emerald-800 bg-emerald-950"
  >
    <div
      class="mx-auto flex w-[94%] items-center gap-2 py-1 md:items-start md:gap-5 lg:w-[60%] 3xl:w-[65%]"
    >
      <CommunityIcon :is-community-owner="data.isOwner" />
      <div class="flex flex-col items-start justify-between py-2">
        <span
          class="max-w-[105px] overflow-hidden text-base font-semibold md:max-w-[350px] md:text-3xl"
          >{{ community }}</span
        >
        <span
          class="max-w-[105px] overflow-hidden whitespace-nowrap text-xs md:max-w-[300px] md:text-sm"
          >r/{{ community }}</span
        >
      </div>
      <div class="flex w-full justify-between py-3">
        <div class="flex gap-2 md:gap-4">
          <button
            v-if="authStore.authenticated && data.data"
            @click="onJoinButton"
            class="flex h-8 w-16 items-center justify-center rounded-3xl bg-amber-800 px-2 py-1 text-sm font-bold hover:bg-amber-600 md:w-20 md:text-base"
          >
            {{ joinButtonText }}
          </button>
          <button
            v-if="authStore.authenticated"
            @click="onCreatePostModal"
            class="flex h-8 items-center rounded-md bg-lime-700 px-2 py-1 text-sm transition-colors hover:bg-lime-600 md:text-base"
          >
            {{ createPostText }} post
          </button>
        </div>
        <div v-if="authStore.authenticated && data.isOwner">
          <button @click="onEdit">
            <PhGear size="26" class="cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <EditCommunity
    @modal-clicked="onEditCommunityModal"
    v-if="showEdit && data?.data"
    :data="data.data"
    :refetch="refetchData"
  />
  <div v-if="data?.data" class="mx-auto mt-2 flex max-w-[94%] gap-2 md:hidden">
    <button
      @click="showFeed = true"
      class="rounded-md p-1"
      :class="`${showFeed ? 'bg-teal-600' : 'bg-teal-900'}`"
    >
      Feed
    </button>
    <button
      @click="showFeed = false"
      class="rounded-md p-1"
      :class="`${!showFeed ? 'bg-teal-600' : 'bg-teal-900'}`"
    >
      About
    </button>
  </div>
  <div
    v-if="data?.data"
    class="mx-auto mt-2 flex max-w-[94%] items-start gap-4 border border-none border-white bg-inherit md:mt-6 md:flex lg:max-w-[60%] lg:justify-between 3xl:max-w-[65%]"
  >
    <CommunityInfo v-if="!showFeed" :data="data.data" class="w-full" />
    <PostList v-if="postsData?.data && showFeed" :data="postsData.data" type="subreddit" />
    <CommunityInfo :data="data.data" class="hidden md:block" />
  </div>
</template>

<script setup lang="ts">
// vue
import { ref, computed, watch, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AxiosError } from 'axios'

// other
import { PhGear, PhPencil } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/authStore'
import { leaveCommunity, joinCommunity } from '@/components/CommunityView/helpers'
// components
import SpinnerStatus from '@/components/Spinner/SpinnerStatus.vue'
import NotExistCommunity from '@/components/CommunityView/NotExistCommunity/NotExistCommunity.vue'
import PrivateCommunity from '@/components/CommunityView/PrivateCommunity/PrivateCommunity.vue'
import EditCommunity from '@/components/CommunityView/EditCommunity/EditCommunity.vue'
import CreatePost from '@/components/CreatePost/CreatePost.vue'
import PostList from '@/components/CommunityView/PostList/PostList.vue'
import CommunityInfo from '@/components/CommunityView/CommunityInfo/CommunityInfo.vue'
import EditBanner from '@/components/CommunityView/EditCommunity/EditBanner.vue'
import CommunityIcon from '@/components/CommunityView/EditCommunity/CommunityIcon.vue'
// composables
import useFetchCommunityData from '@/components/Composables/CommunityViewComp/useFetchCommunityData'
import { useFetchCommunityPosts } from '@/components/Composables/CommunityViewComp/useFetchCommunityPosts'
import { BACKEND_API, bannerSize, checkAuthOrRedirect, rndNumber } from '@/helpers/globalHelpers'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
// state
const community = computed(() => route.params.communityName as string)
const bannerSource = ref(
  `${BACKEND_API}/getCommunityImage?term=${community.value}&type=banner&${rndNumber()}`
)
const showEditBanner = ref(false)
const showEdit = ref(false)
const isJoined = ref(false)
const showCreatePost = ref(false)
const isUploadingBanner = ref(false)

const showFeed = ref(true)

const { data, refetch: refetchData } = useFetchCommunityData(community)
const { postsData, refetch: refetchPosts } = useFetchCommunityPosts(community)
const bannerHeight = ref(bannerSize['medium'])
const bannerPositionY = ref('50')

const isMobile = computed(() => window.innerWidth < 500)
const createPostText = computed(() => (window.innerWidth < 500 ? '+' : 'Create'))

watch(data, () => {
  data.value?.isJoined ? (isJoined.value = true) : (isJoined.value = false)
  if (data.value?.data?.bannerHeight) bannerHeight.value = bannerSize[data.value.data.bannerHeight]
  if (data.value?.data?.bannerPositionY) bannerPositionY.value = data.value.data.bannerPositionY
})
watch(route, () => {
  showEditBanner.value = false
  showEdit.value = false
  showCreatePost.value = false
})
watch(community, () => {
  bannerSource.value = `${BACKEND_API}/getCommunityImage?term=${
    community.value
  }&type=banner&${rndNumber()}`
})
// watch(data, () => console.log(toRaw(data.value)))

// callbacks
const onEdit = () => {
  showEdit.value = true
}

const onJoinButton = async () => {
  try {
    if (isJoined.value) {
      await checkAuthOrRedirect(router)
      await leaveCommunity(community.value)
      isJoined.value = false
    } else {
      await checkAuthOrRedirect(router)
      await joinCommunity(community.value)
      isJoined.value = true
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data.message === 'Invalid token!!!') {
        authStore.clearState()
        router.push({ name: 'login' })
      }
    } else console.log(error)
  }
}

const onEditCommunityModal = () => {
  showEdit.value = false
  document.body.style.overflowY = 'auto'
}
const onCreatePostModal = () => {
  showCreatePost.value = !showCreatePost.value
  document.body.style.overflowY = document.body.style.overflowY === 'hidden' ? 'auto' : 'hidden'
}

const joinButtonText = computed(() => (isJoined.value ? 'Joined' : 'Join'))
</script>

<style scoped></style>
