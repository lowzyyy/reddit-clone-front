<template>
  <div
    @click="$emit('modalClicked')"
    class="fixed top-0 z-[60] flex h-screen w-full justify-center bg-slate-800 bg-opacity-50"
  >
    <div
      @click.stop=""
      class="absolute top-28 mx-auto w-full rounded-md border border-white bg-slate-900 p-4 sm:w-[600px] md:top-40"
    >
      <span class="text-lg font-semibold">r/{{ data.name }}</span>
      <span> community settings</span>
      <PhX
        @click.stop="$emit('modalClicked')"
        size="30"
        weight="bold"
        class="absolute right-4 top-4 cursor-pointer transition-colors hover:text-stone-400"
      />
      <fieldset
        @change="
          (event: any) => {
            settingVisibility = event.target.value === 'true'
          }
        "
        class="mt-6 flex w-[400px] items-end justify-between"
      >
        <legend class="mb-1">Visibility</legend>
        <div class="flex flex-col">
          <div>
            <input
              type="radio"
              name="visibility"
              id="public"
              value="true"
              class="mr-2"
              :checked="data.visibility"
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
              :checked="!data.visibility"
            />
            <label for="private">Private</label>
          </div>
        </div>
      </fieldset>
      <label for="description" class="mt-4 block">Description</label>
      <textarea
        v-model="settingDescription"
        name="description"
        id="description"
        cols="30"
        rows="4"
        class="mt-1 resize-none bg-slate-700 px-2 py-1 outline-none"
      ></textarea>
      <div class="mt-6">
        <button
          @click="onUpdate"
          class="rounded-md bg-slate-600 px-2 py-1 font-semibold transition-all hover:bg-slate-700"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { AxiosError } from 'axios'
import { PhX } from '@phosphor-icons/vue'
import { type TCommunitySettings, changeSettings } from './helpers'
import type { TCommunity } from '@/components/Composables/CommunityViewComp/useFetchCommunityData'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { checkAuthOrRedirect } from '@/helpers/globalHelpers'

const { data, refetch } = defineProps<{ data: TCommunity; refetch: () => void }>()

const authStore = useAuthStore()
const router = useRouter()

// state
const isLoading = ref(false)
const settingVisibility = ref(data.visibility)
const settingDescription = ref(data.description)

const buttonText = computed(() => (isLoading.value ? 'Loading...' : 'Update settings'))
document.body.style.overflowY = 'hidden'

const onUpdate = async () => {
  const settings: TCommunitySettings = {}
  settings.visibility = settingVisibility.value
  settings.description = settingDescription.value
  try {
    isLoading.value = true
    await checkAuthOrRedirect(router)
    await changeSettings(data.name, settings)
    refetch()
    isLoading.value = false
  } catch (error: any) {
    if (error instanceof AxiosError)
      if (error.response?.data.message === 'Invalid token!!!') {
        authStore.clearState()
        router.push({ name: 'login' })
      } else console.log(error)
  }
}
</script>

<style scoped></style>
