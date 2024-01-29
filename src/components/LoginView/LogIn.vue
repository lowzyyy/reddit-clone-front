<template>
  <AuthContainer>
    <ErrorMsg :error-msg="errorMsg" />
    <AuthForm :on-submit="onSubmit">
      <UsernameField />
      <PasswordField id="password" />
      <div class="flex w-full justify-between">
        <RememberMeCheckbox v-model:remember="rememberMe" />
        <RouterLink :to="{ name: 'resetpassword' }" class="cursor-pointer text-sm underline"
          >Forgot password?</RouterLink
        >
      </div>
      <SubmitButton :is-processing="isProcessing" button-text="Sign in" />
      <p>
        Don't have an account?
        <RouterLink :to="{ name: 'signup' }" class="underline">Sign up</RouterLink>
      </p>
    </AuthForm>
  </AuthContainer>
</template>

<script setup lang="ts">
import { ref, toRaw, watch } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

// helpers
import { BACKEND_API } from '@/helpers/globalHelpers'
import { setLoginState } from './helpers'
import UsernameField from './HelperComponents/UsernameField.vue'
import PasswordField from './HelperComponents/PasswordField.vue'
import ErrorMsg from './HelperComponents/ErrorMsg.vue'
import SubmitButton from './HelperComponents/SubmitButton.vue'
import RememberMeCheckbox from './HelperComponents/RememberMeCheckbox.vue'
import AuthContainer from './HelperComponents/AuthContainer.vue'
import AuthForm from './HelperComponents/AuthForm.vue'

const router = useRouter()
const rememberMe = ref(false)
const isProcessing = ref(false)
const errorMsg = ref('')

// watch(rememberMe, () => console.log(rememberMe.value))

const onSubmit = async (e: any) => {
  e.preventDefault()
  try {
    isProcessing.value = true
    const { data } = await axios.postForm(`${BACKEND_API}/login`, new FormData(e.target))
    setLoginState(data, rememberMe.value)
    isProcessing.value = false
    router.replace('/')
  } catch (error: any) {
    isProcessing.value = false
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}
</script>

<style scoped></style>
