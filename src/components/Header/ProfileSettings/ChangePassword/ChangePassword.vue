<template>
  <div class="w-full">
    <form @submit="onSave" method="post" autocomplete="off">
      <div>
        <label for="newpass" class="text-sm">New password</label>
        <div class="relative flex w-full items-center">
          <input
            required
            :type="`${showNewPass ? 'text' : 'password'}`"
            v-model="newPassText"
            id="newpass"
            name="password"
            minlength="6"
            class="w-full rounded-sm bg-teal-50 p-1 text-sm font-semibold text-green-950 outline-none"
          />
          <component
            :is="showNewPass ? PhEye : PhEyeSlash"
            size="20"
            @click="showNewPass = !showNewPass"
            class="absolute right-0 text-green-950"
          />
        </div>
      </div>
      <div>
        <label for="confirmpass" class="text-sm">Confirm password</label>
        <div class="relative flex w-full items-center">
          <input
            required
            :type="`${showConfirmPass ? 'text' : 'password'}`"
            v-model="confirmPassText"
            id="confirmpass"
            minlength="6"
            class="w-full rounded-sm bg-teal-50 p-1 pr-6 text-sm font-semibold text-green-950 outline-none"
          />

          <component
            :is="showConfirmPass ? PhEye : PhEyeSlash"
            size="20"
            @click="showConfirmPass = !showConfirmPass"
            class="absolute right-0 text-green-950"
          />
        </div>
      </div>
      <div class="mt-2 flex justify-between">
        <button
          @click="$emit('update:showForm', false)"
          class="rounded-md bg-rose-600 px-2 py-1 text-sm transition-colors hover:bg-rose-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-green-600 px-2 py-1 text-sm transition-colors hover:bg-green-500 disabled:bg-gray-400"
        >
          <span v-if="!isLoading">Save</span>
          <SpinnerStatus v-else class="fill-green-900 text-white" />
        </button>
      </div>
    </form>
    <p v-if="errorMsg.length" class="mt-2 text-center text-xs text-green-50">{{ errorMsg }}</p>
    <p v-if="successMsg.length" class="text-center text-sm font-bold text-teal-500">
      {{ successMsg }}
    </p>
  </div>
</template>

<script setup lang="ts">
import SpinnerStatus from '@/components/Spinner/SpinnerStatus.vue'
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import { PhEye, PhEyeSlash } from '@phosphor-icons/vue'
import axios, { AxiosError } from 'axios'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

defineProps<{ showForm: boolean }>()
const emit = defineEmits(['update:showForm'])

const authStore = useAuthStore()
const router = useRouter()

const showNewPass = ref(false)
const showConfirmPass = ref(false)
const newPassText = ref('')
const confirmPassText = ref('')

const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const onSave = async (e: any) => {
  e.preventDefault()
  errorMsg.value = ''
  successMsg.value = ''
  try {
    isLoading.value = true
    if (newPassText.value !== confirmPassText.value) {
      errorMsg.value = 'Passwords are not the same'
      isLoading.value = false
      return
    }
    const form = new FormData(e.target)
    form.delete('confirmpass')

    await checkAuthOrRedirect(router)
    await axios.postForm(`${BACKEND_API}/changePassword`, form, {
      headers: { Authorization: 'Bearer ' + authStore.user.token }
    })

    isLoading.value = false
    successMsg.value = 'Success!'
    setTimeout(() => {
      emit('update:showForm', false)
    }, 400)
  } catch (error: any) {
    isLoading.value = false
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}
</script>

<style scoped></style>
