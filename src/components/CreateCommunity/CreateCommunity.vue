<template>
  <div>
    <p v-if="errorMsg" class="mb-2 text-center text-sm font-semibold text-red-400">
      {{ errorMsg }}
    </p>
    <label>Community name (min 3, max 20 characters)</label>
    <div class="relative flex items-center">
      <span class="absolute left-2 top-1 flex items-center tracking-widest">r/</span>
      <input
        v-model="name"
        id="name"
        maxlength="20"
        minlength="3"
        class="flex w-full items-center rounded-md bg-slate-800 p-2 pl-6 pt-1 tracking-wider outline-none"
      />
    </div>
    <label for="description" class="mt-4 block">Description</label>
    <textarea
      v-model="description"
      name="description"
      id="description"
      cols="30"
      rows="4"
      class="block bg-slate-700 px-2 py-1 outline-none"
    ></textarea>
    <fieldset
      @change="
        (event: any) => {
          visibility = event.target.value === 'true'
        }
      "
      class="w-fuw-full mt-6 flex items-end justify-between"
    >
      <div class="flex flex-col">
        <div>
          <input
            type="radio"
            name="visibility"
            id="public"
            value="true"
            class="mr-2"
            :checked="visibility"
          />
          <label for="public">Public</label>
        </div>
        <div>
          <input
            type="radio"
            name="visibility"
            id="private"
            value="false"
            class="mr-2"
            :checked="!visibility"
          />
          <label for="private">Private</label>
        </div>
      </div>
      <div>
        <button
          @click="onCreate"
          :disabled="(name.length < 3 || name.length > 20) && description.length === 0"
          class="flex items-center justify-center rounded-md bg-yellow-600 p-1 px-3 text-lg font-bold disabled:bg-gray-500 disabled:text-gray-200"
        >
          Create
        </button>
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import axios, { AxiosError } from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// const { visibility }
const description = ref('')
const visibility = ref(true)
const name = ref('')

const errorMsg = ref<string | null>(null)

const onCreate = async () => {
  try {
    await checkAuthOrRedirect(router)
    await axios.post(
      `${BACKEND_API}/createCommunity`,
      {
        communityData: {
          name: name.value,
          visibility: visibility.value,
          description: description.value
        }
      },
      { headers: { Authorization: 'Bearer ' + `${authStore.user.token}` } }
    )
    router.push(`/r/${name.value}`)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data.message === 'Invalid token!!!') {
        authStore.clearState()
        router.push({ name: 'login' })
      }
      errorMsg.value = error.response?.data.message
    } else console.log(error)
  }
}
</script>

<style scoped></style>
