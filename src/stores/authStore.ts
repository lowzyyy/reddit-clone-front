import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useSearchStore } from './searchStore'

export type UserInfo = {
  username: string
  token: string | undefined
  expiresIn: number
  votedPosts: { [index: string]: boolean }
  votedComments: { [index: string]: boolean }
  id: string
  have_avatar: boolean
}

export const useAuthStore = defineStore('authStore', () => {
  const authenticated = ref(false)
  // user
  const user = ref<UserInfo>({
    username: '',
    token: undefined,
    expiresIn: 0,
    id: '',
    have_avatar: false,
    votedPosts: {},
    votedComments: {}
  })

  const isLoggingIn = ref({ value: true })

  const isInitialLoad = ref(true)

  const clearState = () => {
    const searchStore = useSearchStore()

    user.value.token = undefined
    user.value.votedPosts = {}
    user.value.votedComments = {}
    user.value.username = ''
    user.value.id = ''
    user.value.have_avatar = false

    searchStore.searchPhrase = ''
    localStorage.removeItem('redditAuth')
    authenticated.value = false
  }
  return { authenticated, isInitialLoad, isLoggingIn, user, clearState }
})
