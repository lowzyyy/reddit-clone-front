<template>
  <div
    class="relative h-14 w-14 rounded-full bg-rose-800 bg-cover bg-center text-center md:h-20 md:w-20"
    :style="{ backgroundImage: `url(${imageSource})` }"
  >
    <span
      class="flex h-14 w-14 items-center justify-center align-middle text-sm leading-[80px] md:h-20 md:w-20"
      ><PhPlanet v-if="!validImage" size="40" weight="duotone" class="mx-auto"
    /></span>
    <p v-if="errorMsg.length" class="absolute top-0 z-10 rounded-md bg-teal-500 p-2 text-sm">
      {{ errorMsg }}
      <button class="absolute right-1 top-1 font-bold text-black" @click="errorMsg = ''">X</button>
    </p>
    <label
      v-if="isCommunityOwner"
      for="icon"
      class="absolute bottom-0 right-0 cursor-pointer rounded-full bg-rose-400 p-1 hover:bg-red-400"
    >
      <PhUploadSimple class="text-teal-100" weight="bold" size="18" />
    </label>
    <input
      @change="onChangeImage"
      ref="inputRef"
      type="file"
      name="icon"
      id="icon"
      accept="image/jpeg, image/jpg, image/png"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { BACKEND_API, checkAuthOrRedirect, checkImage } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import { PhUploadSimple, PhPlanet } from '@phosphor-icons/vue'
import axios, { AxiosError } from 'axios'
import { ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { isCommunityOwner } = defineProps<{ isCommunityOwner: boolean | undefined }>()

const route = useRoute()
const authStore = useAuthStore()

const errorMsg = ref('')
const inputRef = ref<HTMLInputElement>()
const imageSource = ref(
  `${BACKEND_API}/getCommunityImage?term=${route.params.communityName}&type=icon`
)
const validImage = ref(false)

watch(route, async () => {
  validImage.value = await checkImage(
    `${BACKEND_API}/getCommunityImage?term=${route.params.communityName}&type=icon`
  )
  imageSource.value = `${BACKEND_API}/getCommunityImage?term=${route.params.communityName}&type=icon`
})

onBeforeMount(
  async () =>
    (validImage.value = await checkImage(
      `${BACKEND_API}/getCommunityImage?term=${route.params.communityName}&type=icon`
    ))
)

const onChangeImage = async () => {
  const router = useRouter()
  try {
    errorMsg.value = ''
    if (inputRef.value) {
      const img = inputRef.value.files

      if (img?.length) {
        await checkAuthOrRedirect(router)
        await axios.post(
          `${BACKEND_API}/setCommunityImage?term=${route.params.communityName}&type=icon`,
          { image: img[0] },
          {
            headers: {
              Authorization: 'Bearer ' + authStore.user.token,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
      }
      validImage.value = await checkImage(imageSource.value)
      if (validImage.value)
        imageSource.value = `${BACKEND_API}/getCommunityImage?term=${
          route.params.communityName
        }&type=icon&${Math.random() * 100}`
    }
  } catch (error: any) {
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}
</script>

<style scoped></style>
