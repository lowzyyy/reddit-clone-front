<template>
  <div class="flex flex-col gap-2 text-base">
    <span class="text-sm"
      >Comment as <span class="font-bold text-lime-500">{{ authStore.user.username }}</span></span
    >
    <div>
      <textarea
        :spellcheck="false"
        v-model="content"
        name="comment"
        id="comment"
        cols="5"
        rows="4"
        class="block w-full resize-none rounded-md border border-emerald-700 bg-slate-900 p-2 outline-none focus:border-slate-300"
      ></textarea>
      <div class="mt-2 flex justify-end gap-2">
        <button
          @click="onPost"
          class="rounded-md bg-teal-600 px-3 py-1 text-sm outline-none hover:bg-teal-500 disabled:bg-gray-500"
          :disabled="content.length === 0"
        >
          Post
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import { useSearchStore } from '@/stores/searchStore'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { postId } = defineProps<{ postId: string }>()

const searchStore = useSearchStore()
const authStore = useAuthStore()
const router = useRouter()

const content = ref('')

const onPost = async () => {
  try {
    await checkAuthOrRedirect(router)
    await axios.post(
      `${BACKEND_API}/postComment`,
      {
        commentData: { postId, parentId: null, content: content.value }
      },
      { headers: { Authorization: 'Bearer ' + authStore.user.token } }
    )
    searchStore.refetchComments()
    content.value = ''
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped></style>
