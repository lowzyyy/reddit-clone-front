<template>
  <AuthContainer>
    <AuthForm :on-submit="onSubmit">
      <ErrorMsg v-if="errorMsg !== 'Invalid token!!!'" :error-msg="errorMsg" />
      <span v-else class="text-sm text-green-100">
        Link expired. Please
        <RouterLink :to="{ name: 'signup' }" class="font-bold underline">create account</RouterLink>
        again</span
      >
      <p v-if="!errorMsg.length" class="text-sm font-semibold text-green-200">{{ otherMsg }}</p>
      <PasswordField ref="newPassRef" id="password" label-text="Password" />
      <PasswordField ref="confPassRef" id="confirmnewpassword" label-text="Confirm password" />
      <RememberMeCheckbox v-model:remember="rememberMe" />
      <SubmitButton button-text="Create account" :is-processing="isProcessing" />
    </AuthForm>
  </AuthContainer>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import PasswordField from './HelperComponents/PasswordField.vue'
import SubmitButton from './HelperComponents/SubmitButton.vue'
import ErrorMsg from './HelperComponents/ErrorMsg.vue'
import { BACKEND_API } from '@/helpers/globalHelpers'
import { setLoginState } from './helpers'
import RememberMeCheckbox from './HelperComponents/RememberMeCheckbox.vue'
import AuthContainer from './HelperComponents/AuthContainer.vue'
import AuthForm from './HelperComponents/AuthForm.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// This is for the case when user login data exists, so app.vue is trying to login him.
// Obviously we dont want that so we logout the user, clear the state so new user can create account.
watch(authStore.isLoggingIn, () => {
  if (!authStore.isLoggingIn.value) {
    authStore.clearState()
  }
})

const isProcessing = ref(false)
const errorMsg = ref('')
const otherMsg = ref('Set your password')
const token = computed(() => route.query.authtoken)
const newPassRef = ref()
const confPassRef = ref()
const rememberMe = ref(false)

const onSubmit = async (e: any) => {
  e.preventDefault()
  errorMsg.value = ''
  otherMsg.value = 'Set your password'
  isProcessing.value = true
  if (newPassRef.value.inputRef.value !== confPassRef.value.inputRef.value) {
    errorMsg.value = 'Passwords are not the same!'
    isProcessing.value = false
    return
  }

  const form = new FormData(e.target)
  form.delete('confirmnewpassword')
  try {
    const { data } = await axios.postForm(`${BACKEND_API}/finishSignup`, form, {
      headers: { Authorization: 'Bearer ' + token.value }
    })
    setLoginState(data, rememberMe.value)
    isProcessing.value = false
    router.push('/')
  } catch (error: any) {
    isProcessing.value = false
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}
</script>

<style scoped></style>
