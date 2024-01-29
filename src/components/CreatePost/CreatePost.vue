<template>
  <div
    ref="modalRef"
    @click="$emit('modalClicked')"
    class="fixed top-0 z-[60] flex h-screen w-full justify-center bg-slate-800 bg-opacity-50"
  >
    <div
      @click.stop=""
      class="absolute top-40 w-full rounded-md border border-slate-200 bg-slate-900 p-4 sm:w-[600px]"
    >
      <h2 class="text-slate-100">Create post for {{ name }}</h2>
      <input
        v-model="title"
        maxlength="60"
        id="title"
        type="text"
        placeholder="Title..."
        class="mt-5 w-full rounded-md border border-slate-700 bg-slate-800 px-2 py-1 outline-none transition-colors hover:border-slate-400"
      />
      <label for="title" class="block text-xs text-slate-400">{{ title.length }}/60</label>
      <textarea
        v-model="content"
        maxlength="1000"
        name="postContent"
        id="content"
        rows="8"
        placeholder="Content of the post..."
        class="mt-5 w-full resize-none rounded-md border border-slate-700 bg-slate-800 px-2 py-1 outline-none transition-colors hover:border-slate-400"
      ></textarea>
      <label for="content" class="block text-xs text-slate-400">{{ content.length }}/1000</label>

      <button
        @click="onPost"
        class="mx-auto mt-6 block rounded-md bg-teal-800 px-3 py-1 text-lg font-bold tracking-widest transition-colors hover:bg-teal-700 disabled:bg-gray-600"
        :disabled="title.length === 0 || content.length === 0"
      >
        Post
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import axios, { AxiosError } from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { name, refetch } = defineProps<{ name: string; refetch: () => void }>()

const router = useRouter()
const authStore = useAuthStore()
// state
const modalRef = ref<HTMLDivElement>()
const title = ref('')
const content = ref('')

const onPost = async () => {
  try {
    await checkAuthOrRedirect(router)
    await axios.post(
      `${BACKEND_API}/createCommunityPost?term=${name}`,
      {
        postData: {
          title: title.value,
          content: content.value
        }
      },
      {
        headers: {
          Authorization: 'Bearer ' + `${authStore.user.token}`
        }
      }
    )
    refetch()
    modalRef.value!.click()
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

<style scoped></style>
