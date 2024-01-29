<template>
  <AuthContainer>
    <AuthForm :on-submit="onSubmit">
      <ErrorMsg :error-msg="errorMsg" />
      <UsernameField />
      <EmailField />
      <p
        v-if="successMsg.length"
        class="w-full text-center text-xs font-bold text-yellow-300"
        :class="`message`"
      >
        {{ successMsg }}
      </p>
      <SubmitButton :is-processing="isProcessing" button-text="Sign up" />
      <p>
        Already have an account?
        <RouterLink :to="{ name: 'login' }" class="underline">Sign in</RouterLink>
      </p>
    </AuthForm>
  </AuthContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'

// helpers
import ErrorMsg from './HelperComponents/ErrorMsg.vue'
import UsernameField from './HelperComponents/UsernameField.vue'
import EmailField from './HelperComponents/EmailField.vue'
import { BACKEND_API } from '@/helpers/globalHelpers'
import SubmitButton from './HelperComponents/SubmitButton.vue'
import AuthContainer from './HelperComponents/AuthContainer.vue'
import AuthForm from './HelperComponents/AuthForm.vue'

const errorMsg = ref('')
const successMsg = ref('')
const isProcessing = ref(false)

const onSubmit = async (e: any) => {
  e.preventDefault()
  try {
    isProcessing.value = true

    await axios.postForm(`${BACKEND_API}/signup`, new FormData(e.target))

    isProcessing.value = false
    e.target.querySelectorAll('input').forEach((el: HTMLInputElement) => {
      el.classList.remove('redborder')
    })
    e.target.querySelectorAll('.message').forEach((el: any) => {
      el.textContent = ''
    })
    e.target.reset()
    successMsg.value = 'Check your email inbox for confirmation email!'
  } catch (error: any) {
    isProcessing.value = false
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}
</script>

<style scoped></style>
