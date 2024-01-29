<template>
  <AuthContainer>
    <AuthForm :on-submit="onSubmit">
      <ErrorMsg v-if="errorMsg !== 'Invalid token!!!'" :error-msg="errorMsg" />
      <span v-else class="text-sm text-green-100">
        Link expired.
        <RouterLink :to="{ name: 'resetpassword' }" class="font-bold underline"
          >Resend email</RouterLink
        >
      </span>
      <p v-if="!errorMsg.length" class="text-sm font-semibold text-green-200">
        {{ username }} set your password
      </p>
      <PasswordField ref="newPassRef" label-text="New password" id="password" />
      <PasswordField ref="confPassRef" label-text="Confirm new password" id="confirmpassword" />
      <p v-if="successMsg.length" class="text-base font-semibold text-green-200">
        {{ successMsg }}
      </p>
      <SubmitButton button-text="Reset password" :is-processing="isProcessing" />
    </AuthForm>
  </AuthContainer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PasswordField from './HelperComponents/PasswordField.vue'
import SubmitButton from './HelperComponents/SubmitButton.vue'
import ErrorMsg from './HelperComponents/ErrorMsg.vue'
import AuthContainer from './HelperComponents/AuthContainer.vue'
import { useRoute } from 'vue-router'
import AuthForm from './HelperComponents/AuthForm.vue'
import axios, { AxiosError } from 'axios'
import { BACKEND_API } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()

const isProcessing = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const newPassRef = ref()
const confPassRef = ref()
const token = computed(() => route.query.authtoken)
const username = computed(() => route.query.username)

watch(authStore.isLoggingIn, () => {
  if (!authStore.isLoggingIn.value) {
    authStore.clearState()
  }
})

const onSubmit = async (e: any) => {
  e.preventDefault()
  errorMsg.value = ''
  successMsg.value = ''
  isProcessing.value = true
  try {
    if (newPassRef.value.inputRef.value !== confPassRef.value.inputRef.value) {
      errorMsg.value = 'Passwords are not the same!'
      isProcessing.value = false
      return
    }
    await axios.post(`${BACKEND_API}/changePassword`, new FormData(e.target), {
      headers: { Authorization: 'Bearer ' + token.value }
    })
    isProcessing.value = false
    successMsg.value = 'Success. Now you can login.'
  } catch (error: any) {
    isProcessing.value = false
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}
</script>

<style scoped></style>
