import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { BACKEND_API } from '@/helpers/globalHelpers'

export const leaveCommunity = async (community: string) => {
  const authStore = useAuthStore()
  await axios.post(
    `${BACKEND_API}/leaveCommunity?term=${community}`,
    {},
    { headers: { Authorization: 'Bearer ' + `${authStore.user.token}` } }
  )
}

export const joinCommunity = async (community: string) => {
  const authStore = useAuthStore()
  await axios.post(
    `${BACKEND_API}/joinCommunity?term=${community}`,
    {},
    { headers: { Authorization: 'Bearer ' + `${authStore.user.token}` } }
  )
}
