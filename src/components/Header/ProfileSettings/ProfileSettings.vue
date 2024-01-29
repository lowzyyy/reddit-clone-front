<template>
  <div
    @click.stop=""
    class="absolute right-0 top-8 w-[300%] rounded-md border border-teal-600 bg-teal-700 xs:w-[200%]"
  >
    <ul
      class="text-sm md:text-base [&>li:first-child]:rounded-t-md [&>li:hover]:bg-teal-900 [&>li:last-child]:rounded-b-md [&>li:last-child]:border-none [&>li]:border-b [&>li]:border-teal-100 [&>li]:p-2"
    >
      <li class="">
        <span v-if="!showPassForm" @click="showPassForm = true" class="block w-full cursor-pointer">
          Change password
        </span>
        <ChangePassword v-else v-model:show-form="showPassForm" />
      </li>
      <li class="flex items-center">
        <label v-if="!isLoadingAvatar" for="avatar" class="block w-full cursor-pointer"
          >Change avatar</label
        >
        <input
          @change="onChangeImage"
          ref="avatarRef"
          type="file"
          name="avatar"
          id="avatar"
          accept="image/jpeg, image/jpg, image/png"
          class="hidden"
        />
        <span
          v-if="!isLoadingAvatar && authStore.user.have_avatar && !errorMsg.length"
          class="rounded-md border border-teal-700 p-1 hover:bg-teal-600"
          title="Remove avatar"
        >
          <PhTrashSimple @click="onRemoveImage" weight="duotone" size="20" class="text-white" />
        </span>
        <SpinnerStatus
          v-if="isLoadingAvatar"
          class="w-full fill-white text-center text-green-500"
        ></SpinnerStatus>
        <p
          v-if="errorMsg.length"
          class="mt-2 cursor-default rounded-md border border-red-400 p-2 text-center text-sm font-semibold text-green-200"
        >
          {{ errorMsg }}
        </p>
      </li>
      <li class="">
        <button
          v-if="authStore.authenticated"
          class="flex w-full items-center gap-3"
          @click="logOutHandler"
        >
          Log out <PhSignOut size="18" weight="bold" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios, { AxiosError } from 'axios'
import SpinnerStatus from '@/components/Spinner/SpinnerStatus.vue'
import ChangePassword from '@/components/Header/ProfileSettings/ChangePassword/ChangePassword.vue'
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import { PhSignOut, PhTrashSimple } from '@phosphor-icons/vue'

defineProps<{ imageSource: string }>()
const emit = defineEmits(['update:imageSource'])

const authStore = useAuthStore()
const router = useRouter()

// password
const showPassForm = ref(false)

// avatar
const avatarRef = ref<HTMLInputElement>()
const errorMsg = ref('')
const isLoadingAvatar = ref(false)
const onChangeImage = async () => {
  try {
    if (avatarRef.value) {
      const img = avatarRef.value.files
      if (img?.length) {
        isLoadingAvatar.value = true
        await checkAuthOrRedirect(router)
        await axios.post(
          `${BACKEND_API}/setUserImage?type=avatar`,
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
        authStore.user.have_avatar = true
        emit('update:imageSource', URL.createObjectURL(img[0]))
        router.go(0)
      }
    }
  } catch (error: any) {
    isLoadingAvatar.value = false
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}

const onRemoveImage = async () => {
  try {
    isLoadingAvatar.value = true
    await axios.post(
      `${BACKEND_API}/setUserImage?type=avatar&shouldDelete=true`,
      {},
      { headers: { Authorization: 'Bearer ' + authStore.user.token } }
    )
    authStore.user.have_avatar = false
    emit('update:imageSource', '')
    router.go(0)
  } catch (error: any) {
    isLoadingAvatar.value = false
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}

const logOutHandler = async () => {
  try {
    router.go(0)
    authStore.clearState()
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped></style>
