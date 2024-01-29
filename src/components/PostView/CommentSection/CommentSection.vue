<template>
  <div class="mb-6 mt-6 w-[320px] p-2 xs:w-[360px] sm:w-[500px] md:px-5 lg:w-[600px]">
    <RouterLink
      v-if="route.name === 'postview with pruned comments'"
      :to="{ name: 'postview with comments' }"
      class="mb-3 block cursor-pointer text-cyan-400 hover:text-cyan-300 hover:underline"
      >Back to all comments</RouterLink
    >
    <label
      v-if="data && data.length > 0"
      for="sortType"
      class="rounded-l-md bg-emerald-700 py-1 pl-2"
      >Sort by :</label
    >
    <select
      v-if="data && data.length > 0"
      v-model="sortType"
      name="sortType"
      id="sortType"
      class="cursor-pointer rounded-r-md bg-emerald-700 py-1 pl-2 pr-1 text-base text-slate-200"
    >
      <option class="hover:bg-yellow-200" value="top">Top</option>
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
    </select>
    <div v-if="data && data?.length > 0">
      <div v-for="comment in data" :key="comment.id" class="mt-4 list-inside">
        <CommentItem :data="comment" />
      </div>
    </div>
    <div v-if="data && data.length === 0" class="mt-2 p-2 text-center">No comments!</div>
  </div>
</template>

<script setup lang="ts">
import { useFetchCommentsData } from '@/components/Composables/PostViewComp/useFetchCommentsData'
import { useFetchSingleCommentData } from '@/components/Composables/PostViewComp/useFetchSingleCommentData'
import { type TSort } from '@/components/PostView/CommentSection/helpers'
import { computed, watch, toRaw, ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import CommentItem from './CommentItem.vue'
import { refetchCommentsKey } from '@/helpers/globalHelpers'
import { useSearchStore } from '@/stores/searchStore'

const { pruned } = defineProps<{ pruned: boolean }>()

const searchStore = useSearchStore()
const route = useRoute()
const postId = computed(() => route.params.postId as string)
const commentId = computed(() => route.params.commentId as string)

const sortType = ref<TSort>('top')
const { data, refetch: refetchComments } = pruned
  ? useFetchSingleCommentData(commentId, sortType)
  : useFetchCommentsData(postId, sortType)
provide(refetchCommentsKey, refetchComments)
searchStore.refetchComments = refetchComments
</script>

<style scoped></style>
