import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('searchStore', () => {
  const searchPhrase = ref('')
  const refetchComments = () => {}
  return { searchPhrase, refetchComments }
})
