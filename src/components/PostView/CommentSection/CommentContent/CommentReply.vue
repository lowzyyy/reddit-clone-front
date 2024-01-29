<template>
  <div class="mb-3 ml-3 mt-3 border-l-2 border-l-green-600 pl-8 pr-4 text-sm md:pr-8 md:text-base">
    <textarea
      v-model="replyContent"
      :spellcheck="false"
      name="replyCommentArea"
      id="replyCommentArea"
      rows="3"
      class="max-w-full resize-none rounded-md border border-slate-700 bg-slate-800 p-2 outline-none focus:border-slate-300"
    ></textarea>
    <div class="mt-2 flex w-full items-center gap-3">
      <button
        @click="onReply"
        :disabled="replyContent.length < 1"
        class="rounded-md bg-slate-700 px-1 py-1 font-semibold outline-none hover:bg-teal-800 disabled:bg-gray-400 sm:px-3"
      >
        Reply
      </button>
      <button
        @click="$emit('update:showReply', false)"
        class="rounded-md bg-slate-700 px-1 py-1 font-semibold outline-none hover:bg-red-400 sm:px-3"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import axios from 'axios'
import {
  BACKEND_API,
  checkAuthOrRedirect,
  postIdKey,
  refetchCommentsKey
} from '@/helpers/globalHelpers'
import type { TCommentWSubcomment } from '@/components/Composables/PostViewComp/useFetchCommentsData'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const postId = inject(postIdKey)
const refetchComments = inject(refetchCommentsKey)
const { data } = defineProps<{ showReply: boolean; data: TCommentWSubcomment }>()
const emit = defineEmits(['update:showReply'])

const authStore = useAuthStore()
const router = useRouter()
const replyContent = ref('')

const onReply = async () => {
  try {
    await checkAuthOrRedirect(router)
    await axios.post(
      `${BACKEND_API}/postComment`,
      {
        commentData: {
          postId,
          parentId: data.id,
          content: replyContent.value
        }
      },
      { headers: { Authorization: 'Bearer ' + authStore.user.token } }
    )
    if (refetchComments) refetchComments()
    emit('update:showReply', false)
    // console.log({ postId, parentId: data.parent_id, content: replyContent.value })
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped></style>
