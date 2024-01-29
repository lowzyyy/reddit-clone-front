import { BACKEND_API } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

export type TCommunitySettings = { visibility?: boolean; description?: string }

export const changeSettings = async (communityName: string, settings: TCommunitySettings) => {
  const authStore = useAuthStore()
  await axios.post(
    `${BACKEND_API}/changeSettingsCommunity?term=${communityName}`,
    { settings },
    { headers: { Authorization: 'Bearer ' + authStore.user.token } }
  )
}
