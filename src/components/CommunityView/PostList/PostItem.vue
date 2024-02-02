<template>
  <div
    class="relative flex overflow-clip pl-9 text-base md:pl-12"
    :class="`${
      isInList
        ? 'rounded-md border border-teal-700 bg-teal-900 pr-0 '
        : 'rounded-t-md border-none bg-teal-900 pr-4 lg:pr-11'
    } `"
  >
    <div
      class="absolute left-0 top-0 flex h-full flex-col items-center gap-1 rounded-l-md p-2 px-2 md:px-3"
      :class="`${isInList ? 'bg-teal-950' : 'bg-teal-900'}`"
    >
      <PhArrowFatUp
        size="24"
        class="cursor-pointer"
        @click="onUpvote"
        :weight="`${vote && authStore.authenticated ? 'fill' : 'regular'}`"
        :class="`${vote && authStore.authenticated ? 'text-yellow-500' : 'text-indigo-200'}`"
      />
      <span
        class="text-base"
        :class="`${numOfVotes < 0 && 'text-red-400'} ${numOfVotes > 0 && 'text-yellow-400'}`"
        >{{ numOfVotes }}</span
      >
      <PhArrowFatDown
        size="24"
        class="cursor-pointer"
        @click="onDownvote"
        :weight="`${vote === false && authStore.authenticated ? 'fill' : 'regular'}`"
        :class="`${vote === false && authStore.authenticated ? 'text-red-500' : 'text-indigo-200'}`"
      />
    </div>
    <component
      :is="isInList ? 'RouterLink' : 'div'"
      :to="{
        name: 'postview with comments',
        params: { communityName: postData.community_id, postId: postData.id }
      }"
      class="flex w-full flex-col gap-2 px-1 py-2 pl-2"
    >
      <h5 class="flex gap-2 text-xs text-teal-100 md:text-sm">
        <RouterLink
          :to="{ name: 'communityview', params: { communityName: postData.community_id } }"
          class="text-white hover:underline"
          :class="`${isInList ? '' : 'text-cyan-500 hover:text-cyan-300'}`"
          >r/{{ postData.community_id }}</RouterLink
        >
        <span>by u/{{ postData.username }}</span>
        <span>{{ postedTime }}</span>
      </h5>
      <h3 class="text-2xl">{{ postData.title }}</h3>
      <div class="max-h-[300px] overflow-clip text-sm sm:text-base" :class="{ mask: isInList }">
        {{ postData.content }}
      </div>
      <div class="mt-3 text-sm text-gray-300">{{ postData.numOfComments }} comments</div>
      <slot />
    </component>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
//components
import { getVotedPosts, updateVote } from '@/components/CommunityView/PostList/helpers'
import type { TPost } from '@/components/Composables/CommunityViewComp/useFetchCommunityPosts'
import { useFetchVotes } from '@/components/Composables/PostViewComp/useFetchVotes'
// other
import { formatPostedTime } from '@/helpers/globalHelpers'
import { PhArrowFatDown, PhArrowFatUp } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/authStore'

const { postData } = defineProps<{ postData: TPost; isInList?: boolean }>()

const authStore = useAuthStore()
const router = useRouter()
const postedTime = formatPostedTime(postData.createdAt)

// state
const vote = ref<boolean | undefined>(authStore.user.votedPosts[postData.id])
const numOfVotes = ref(postData.votes)
const { data: voteData, refetch } = useFetchVotes(postData.id, 'Post')

watch(voteData, () => {
  if (voteData.value?.data) {
    numOfVotes.value = voteData.value.data.votes
  }
})

const onDownvote = async () => {
  if (!authStore.authenticated) return
  try {
    if (vote.value === undefined) {
      await updateVote(postData.id, 'downvote', -1, router)
      vote.value = false
    } else if (vote.value === true) {
      await updateVote(postData.id, 'downvote', -2, router)
      vote.value = false
    } else {
      await updateVote(postData.id, 'remove', 1, router)
      vote.value = undefined
    }
    // update votes number
    refetch()
    // update voted posts object
    authStore.user.votedPosts = await getVotedPosts(router)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data.message === 'Invalid token!!!') {
        authStore.clearState()
        router.push({ name: 'login' })
      }
    } else console.log(error)
  }
}
const onUpvote = async () => {
  if (!authStore.authenticated) return
  try {
    if (vote.value === undefined) {
      await updateVote(postData.id, 'upvote', 1, router)
      vote.value = true
    } else if (vote.value === false) {
      await updateVote(postData.id, 'upvote', 2, router)
      vote.value = true
    } else {
      await updateVote(postData.id, 'remove', -1, router)
      vote.value = undefined
    }
    refetch()
    authStore.user.votedPosts = await getVotedPosts(router)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data.message === 'Invalid token!!!') {
        authStore.clearState()
        router.push({ name: 'login' })
      }
    } else console.log(error)
  }
}
</script>

<style scoped>
.mask {
  mask-image: linear-gradient(180deg, #000000 60%, transparent);
}
</style>
