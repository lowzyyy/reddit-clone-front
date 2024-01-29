<template>
  <h5 class="flex items-center gap-2 text-xs text-slate-400">
    <PhArrowsOutSimple
      v-if="foldComments"
      size="18"
      @click="foldComments = false"
      class="cursor-pointer text-slate-400 hover:text-slate-200"
    />
    <span
      class="flex h-6 w-6 items-center justify-center rounded-full bg-orange-300 bg-cover bg-center"
      :style="{
        backgroundImage: `url(${
          data.have_avatar ? `${BACKEND_API}/users/${data.owner_id}?${rndNumber()}` : ''
        } )`
      }"
      ><PhUser v-if="!data.have_avatar" size="20" weight="bold" class="text-teal-900"
    /></span>
    <span class="">{{ data.username }}</span>
    <span>{{ postedTime }}</span>
  </h5>

  <div class="relative ml-[10px] mt-2 w-full hover:border-red-400">
    <button
      @click="foldComments = true"
      class="absolute left-0 top-0 h-full w-[3px] bg-green-600 hover:bg-green-300"
    />
    <ul v-if="!foldComments" class="list-inside pl-8">
      <CommentContent :data="data" />
      <li v-for="c in data.subComments" :key="c.id" class="mt-2">
        <CommentItem v-if="c.level < maxLevel" :data="c" />
        <RouterLink
          :to="{ name: 'postview with pruned comments', params: { commentId: c.id } }"
          v-if="c.level === maxLevel - 1 && c.subComments"
          class="cursor-pointer rounded-sm bg-yellow-700 p-1 text-sm"
          >Load more...</RouterLink
        >
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { TCommentWSubcomment } from '@/components/Composables/PostViewComp/useFetchCommentsData'
import { BACKEND_API, formatPostedTime, rndNumber } from '@/helpers/globalHelpers'
import { PhArrowsOutSimple, PhUser } from '@phosphor-icons/vue'
import { ref, watch } from 'vue'
import CommentContent from './CommentContent/CommentContent.vue'
const { data } = defineProps<{ data: TCommentWSubcomment }>()

const postedTime = formatPostedTime(data.createdAt)

const maxLevel = ref(window.innerWidth < 500 ? 3 : 5)
window.addEventListener('resize', () => {
  if (window.innerWidth < 500) maxLevel.value = 3
  else maxLevel.value = 5
})

const foldComments = ref(false)
</script>

<style scoped></style>
