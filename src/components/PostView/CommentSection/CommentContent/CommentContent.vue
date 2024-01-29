<template>
  <div>
    <CommentEdit
      v-if="inEditMode"
      v-model:is-edit-mode="inEditMode"
      v-model:content="commentContent"
      :data="data"
    />
    <p
      v-if="!inEditMode"
      class="w-full overflow-y-auto break-words pr-10 text-sm md:text-base lg:pr-5 lg:text-base"
      :class="`${commentContent === '' ? 'italic text-slate-300' : ''}`"
    >
      {{ commentContent === '' ? 'deleted' : commentContent }}
    </p>

    <div v-show="!inEditMode" class="flex w-full items-center gap-3 py-2">
      <span class="flex gap-2">
        <PhArrowFatUp
          size="20"
          class="cursor-pointer hover:rounded-md hover:bg-slate-700"
          @click="onUpvote"
          :weight="`${vote && authStore.authenticated ? 'fill' : 'regular'}`"
          :class="`${vote && authStore.authenticated ? 'text-yellow-500' : 'text-slate-400'}`" />
        <span class="text-base">{{ numOfVotes }}</span>
        <PhArrowFatDown
          size="20"
          class="cursor-pointer hover:rounded-md hover:bg-slate-700"
          @click="onDownvote"
          :weight="`${vote === false && authStore.authenticated ? 'fill' : 'regular'}`"
          :class="`${
            vote === false && authStore.authenticated ? 'text-red-500' : 'text-slate-400'
          }`"
      /></span>
      <span
        v-if="authStore.authenticated && commentContent.length > 0"
        @click="showReply = !showReply"
        class="flex cursor-pointer items-center gap-1 p-1 text-xs text-slate-300 hover:rounded-md hover:bg-slate-700"
      >
        <PhChatCentered size="19" weight="regular" /> Reply
      </span>
      <span
        v-if="data.isOwner && commentContent.length > 0"
        ref="menuButtonRef"
        class="relative cursor-pointer hover:rounded-md hover:bg-slate-700"
        @click="onCommentMenu"
      >
        <PhDotsThree weight="bold" size="30" />
        <CommentOptions
          v-if="showOptions"
          @commentEdit="onEdit"
          @commentDelete="onDelete"
          :menu-height="menuHeight"
        />
      </span>
    </div>
    <CommentReply v-if="showReply" v-model:show-reply="showReply" :data="data" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios, { AxiosError } from 'axios'
//components
import CommentEdit from './CommentEdit.vue'
import CommentOptions from './CommentOptions.vue'
import CommentReply from './CommentReply.vue'
import type { TCommentWSubcomment } from '@/components/Composables/PostViewComp/useFetchCommentsData'
import { updateVote, getVotedComments } from '@/components/PostView/CommentSection/helpers'
import { useFetchVotes } from '@/components/Composables/PostViewComp/useFetchVotes'
// other
import { useAuthStore } from '@/stores/authStore'
import { PhArrowFatDown, PhArrowFatUp, PhChatCentered, PhDotsThree } from '@phosphor-icons/vue'
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'

const { data } = defineProps<{ data: TCommentWSubcomment }>()

const authStore = useAuthStore()
const router = useRouter()
// state
const vote = ref<boolean | undefined>(authStore.user.votedComments[data.id])
const numOfVotes = ref(data.votes)
// options
const menuButtonRef = ref<HTMLDivElement>()
const menuOptionsRef = ref() //exposed ref
const showOptions = ref(false)
const menuHeight = ref(0)
// edit
const inEditMode = ref(false)
const commentContent = ref(data.content)
// reply
const showReply = ref(false)

const { data: voteData, refetch } = useFetchVotes(data.id, 'Comment')

// callbacks
const onCommentMenu = () => {
  menuHeight.value = menuButtonRef.value!.getBoundingClientRect().height
}

const onOutsideClickMenu = (e: any) => {
  if (
    !menuOptionsRef.value?.childMenu.contains(e.target) &&
    !menuButtonRef.value?.contains(e.target)
  )
    showOptions.value = false
  else showOptions.value = !showOptions.value
}
onMounted(() => document.addEventListener('click', onOutsideClickMenu))
onUnmounted(() => document.removeEventListener('click', onOutsideClickMenu))

watch(voteData, () => {
  if (voteData.value?.data) numOfVotes.value = voteData.value.data.votes
})

const onDownvote = async () => {
  if (!authStore.authenticated) return
  try {
    if (vote.value === undefined) {
      await updateVote(data.id, 'downvote', -1, router)
      vote.value = false
    } else if (vote.value === true) {
      await updateVote(data.id, 'downvote', -2, router)
      vote.value = false
    } else {
      await updateVote(data.id, 'remove', 1, router)
      vote.value = undefined
    }
    // update votes number
    refetch()
    // update voted posts object
    authStore.user.votedComments = await getVotedComments(router)
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
      await updateVote(data.id, 'upvote', 1, router)
      vote.value = true
    } else if (vote.value === false) {
      await updateVote(data.id, 'upvote', 2, router)
      vote.value = true
    } else {
      await updateVote(data.id, 'remove', -1, router)
      vote.value = undefined
    }
    refetch()
    authStore.user.votedComments = await getVotedComments(router)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data.message === 'Invalid token!!!') {
        authStore.clearState()
        router.push({ name: 'login' })
      }
    } else console.log(error)
  }
}

const onEdit = () => {
  inEditMode.value = true
}

const onDelete = async () => {
  try {
    await checkAuthOrRedirect(router)
    await axios.delete(`${BACKEND_API}/deleteComment?commentId=${data.id}`, {
      headers: { Authorization: 'Bearer ' + authStore.user.token }
    })
    commentContent.value = ''
    // if (refetchComments) refetchComments()
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data)
    else console.log(error)
  }
}
</script>

<style scoped></style>
