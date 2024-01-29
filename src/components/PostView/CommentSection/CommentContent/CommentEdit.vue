<template>
  <textarea
    v-model="editTextContent"
    name="editCommentArea"
    id="editCommentArea"
    rows="3"
    class="w-full resize-none rounded-md border border-slate-700 bg-slate-800 p-2 text-sm outline-none focus:border-slate-300 md:text-base"
  ></textarea>
  <div class="mt-2 flex w-full items-center gap-3">
    <button
      @click="onSave"
      class="rounded-md bg-slate-700 px-1 py-1 text-sm font-semibold outline-none hover:bg-teal-800 sm:px-3 sm:text-base"
    >
      Save
    </button>
    <button
      @click="$emit('update:isEditMode', false)"
      class="rounded-md bg-slate-700 px-1 py-1 text-sm font-semibold outline-none hover:bg-red-400 sm:px-3 sm:text-base"
    >
      Cancel
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TCommentWSubcomment } from '@/components/Composables/PostViewComp/useFetchCommentsData'
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import axios, { AxiosError } from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { data, content } = defineProps<{
  data: TCommentWSubcomment
  isEditMode: boolean
  content: string
}>()
const emit = defineEmits(['update:isEditMode', 'update:content'])

const authStore = useAuthStore()
const router = useRouter()
const editTextContent = ref(content)

const onSave = async () => {
  try {
    await checkAuthOrRedirect(router)
    await axios.post(
      `${BACKEND_API}/editComment?commentId=${data.id}`,
      {
        content: editTextContent.value
      },
      {
        headers: { Authorization: 'Bearer ' + `${authStore.user.token}` }
      }
    )
    emit('update:content', editTextContent.value)
    emit('update:isEditMode', false)
  } catch (error) {
    emit('update:content', data.content)
    if (error instanceof AxiosError) console.log(error.response?.data)
    else console.log(error)
  }
}
</script>

<style scoped></style>
