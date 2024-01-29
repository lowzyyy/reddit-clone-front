import { useAuthStore, type UserInfo } from '@/stores/authStore'
import { useSearchStore } from '@/stores/searchStore'

export type loginData = UserInfo & {
  expiresIn: string
}

export const setLoginState = (data: loginData, rememberMe: boolean) => {
  const authStore = useAuthStore()
  const searchStore = useSearchStore()

  authStore.user.username = data.username
  authStore.user.token = data.token
  authStore.user.expiresIn = +data.expiresIn
  authStore.user.votedPosts = data.votedPosts ?? {}
  authStore.user.votedComments = data.votedComments ?? {}
  authStore.user.id = data.id
  authStore.user.have_avatar = data.have_avatar

  authStore.authenticated = true
  searchStore.searchPhrase = ''
  localStorage.setItem(
    'redditAuth',
    JSON.stringify({
      token: data.token,
      expiresIn: data.expiresIn,
      username: data.username,
      rememberMe: rememberMe
    })
  )
}
