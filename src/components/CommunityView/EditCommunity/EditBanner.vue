<template>
  <div
    @click.stop=""
    class="grow-1 absolute left-0 top-0 z-30 flex w-[250px] animate-slideRight flex-col gap-4 break-words rounded-r-md bg-green-700 p-3 md:bg-green-600"
  >
    <PhX
      @click="$emit('modalClicked')"
      size="24"
      class="absolute right-3 top-3 cursor-pointer rounded-md hover:bg-green-700"
    />
    <fieldset @change="onChangeHeight">
      <legend class="mb-1 font-semibold text-green-100">Height</legend>
      <div>
        <input
          type="radio"
          name="bannerHeight"
          id="small"
          value="small"
          :checked="currentBannerSize === 'small'"
          class="mr-2"
        />
        <label for="small">Small</label>
      </div>
      <div>
        <input
          type="radio"
          name="bannerHeight"
          id="medium"
          value="medium"
          :checked="currentBannerSize === 'medium'"
          class="mr-2"
        />
        <label for="medium">Medium</label>
      </div>
      <div>
        <input
          type="radio"
          name="bannerHeight"
          id="large"
          value="large"
          :checked="currentBannerSize === 'large'"
          class="mr-2"
        />
        <label for="large">Large</label>
      </div>
    </fieldset>

    <div>
      <span class="mb-2 block font-semibold text-green-100">Image</span>
      <label
        v-if="!validImage"
        for="imgFile"
        class="flex h-[100px] w-[200px] cursor-pointer items-center justify-center rounded-md bg-teal-800 transition-colors hover:bg-teal-700"
        ><span class="flex flex-col items-center justify-center">
          <PhCloudArrowUp weight="fill" size="40" /> <span>Upload picture</span>
        </span>
      </label>
      <div v-if="validImage" class="relative h-[100px] w-[200px]">
        <img :src="imageSource" alt="" class="inline-block h-full w-full rounded-md object-cover" />
        <div class="absolute bottom-0 left-0 z-20 block w-full bg-black">
          <button @click="onDelete" class="ml-auto block">
            <PhTrash size="20" />
          </button>
        </div>
      </div>
      <input
        @change="onChangeImage"
        ref="inputRef"
        type="file"
        name="imgFile"
        id="imgFile"
        accept="image/jpeg, image/jpg, image/png"
        class="hidden"
      />
      <p class="text-sm font-semibold text-green-200">{{ errorMsg }}</p>
      <label for="imgPosition" class="font-semibold text-green-100">Image position </label>
      <span class="font-semibold">{{ imagePosition }}</span>
      <input
        @input="onRange"
        type="range"
        id="imgPosition"
        min="0"
        max="100"
        step="1"
        :value="imagePosition"
        class="accent-teal-300"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import axios, { AxiosError } from 'axios'
import { PhCloudArrowUp, PhTrash, PhX } from '@phosphor-icons/vue'
import {
  BACKEND_API,
  bannerSize,
  checkAuthOrRedirect,
  checkImage,
  rndNumber
} from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import { onBeforeMount, ref } from 'vue'

const emit = defineEmits([
  'modalClicked',
  'setBannerHeight',
  'update:imageSource',
  'update:imagePosition',
  'update:isUploading'
])
const { imageSource } = defineProps<{
  currentBannerSize: string
  imageSource: string
  imagePosition: string
  isUploading: boolean
}>()
const inputRef = ref<HTMLInputElement>()

const errorMsg = ref('')

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const validImage = ref(false)
onBeforeMount(async () => {
  validImage.value = await checkImage(imageSource)
})

const onChangeHeight = async (event: any) => {
  try {
    await checkAuthOrRedirect(router)
    await axios.post(
      `${BACKEND_API}/changeSettingsCommunity?term=${route.params.communityName}`,
      {
        settings: {
          bannerHeight: event.target.value
        }
      },
      { headers: { Authorization: 'Bearer ' + authStore.user.token } }
    )
    emit('setBannerHeight', bannerSize[event.target.value])
  } catch (error) {
    console.log(error)
  }
}

const onChangeImage = async () => {
  try {
    errorMsg.value = ''
    emit('update:isUploading', true)
    if (inputRef.value) {
      const img = inputRef.value.files
      if (img?.length) {
        await checkAuthOrRedirect(router)
        await axios.post(
          `${BACKEND_API}/setCommunityImage?term=${route.params.communityName}&type=banner`,
          {
            image: img[0]
          },
          {
            headers: {
              Authorization: 'Bearer ' + authStore.user.token,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        emit('update:isUploading', false)
        const newImgUrl = `${BACKEND_API}/getCommunityImage?term=${
          route.params.communityName
        }&type=banner&${rndNumber()}`
        emit('update:imageSource', newImgUrl)
        validImage.value = await checkImage(newImgUrl)
      }
    }
  } catch (error: any) {
    emit('update:isUploading', false)
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}

const onDelete = async () => {
  try {
    await checkAuthOrRedirect(router)
    await axios.post(
      `${BACKEND_API}/setCommunityImage?term=${route.params.communityName}&shouldDelete=true&type=banner`,
      {},
      { headers: { Authorization: 'Bearer ' + authStore.user.token } }
    )
    emit('update:imageSource', '')
    validImage.value = false
  } catch (error: any) {
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}

const debounceTimer = ref<undefined | number>(undefined)
const onRange = async (event: any) => {
  clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(async () => {
    await checkAuthOrRedirect(router)
    await axios.post(
      `${BACKEND_API}/changeSettingsCommunity?term=${route.params.communityName}`,
      {
        settings: {
          bannerPosition: event.target.value
        }
      },
      { headers: { Authorization: 'Bearer ' + authStore.user.token } }
    )
  }, 400)
  emit('update:imagePosition', event.target.value)
}
</script>

<style scoped></style>
