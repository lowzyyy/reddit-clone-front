<template>
  <AuthContainer>
    <AuthForm :on-submit="onSubmit">
      <p class="text-sm font-semibold text-green-200">Type email of your account</p>
      <EmailField type="reset" />
      <p v-if="successMsg.length" class="text-base font-semibold text-green-200">
        {{ successMsg }}
      </p>
      <SubmitButton button-text="Send reset email" :is-processing="isProcessing" />
    </AuthForm>
  </AuthContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthContainer from './HelperComponents/AuthContainer.vue'
import EmailField from './HelperComponents/EmailField.vue'
import SubmitButton from './HelperComponents/SubmitButton.vue'
import AuthForm from './HelperComponents/AuthForm.vue'
import axios, { AxiosError } from 'axios'
import { BACKEND_API } from '@/helpers/globalHelpers'

const isProcessing = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const onSubmit = async (e: any) => {
  e.preventDefault()
  errorMsg.value = ''
  successMsg.value = ''
  try {
    isProcessing.value = true
    await axios.postForm(`${BACKEND_API}/requestResetPassword`, new FormData(e.target))
    e.target.reset()
    e.target.querySelectorAll('input').forEach((el: HTMLInputElement) => {
      el.classList.remove('redborder')
    })
    isProcessing.value = false
    successMsg.value = 'Email sent. Please check your inbox.'
  } catch (error: any) {
    isProcessing.value = false
    if (error instanceof AxiosError) errorMsg.value = error.response?.data.message
    else errorMsg.value = error.message
  }
}
</script>

<style scoped></style>
