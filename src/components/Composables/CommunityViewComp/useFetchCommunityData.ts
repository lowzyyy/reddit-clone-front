import { ref, watchEffect, type ComputedRef, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useRouter } from 'vue-router'

export type TCommunity = {
  name: string
  createdAt: number
  members: number
  visibility: boolean
  description: string
  bannerHeight: string
  bannerPositionY: string
}

export type TCommunityInfo = {
  data: TCommunity | null
  message?: string
  isOwner?: boolean
  isJoined?: boolean
}
const useFetchCommunityData = (community: ComputedRef<string>) => {
  const data = ref<TCommunityInfo | undefined>(undefined)
  const router = useRouter()
  const authStore = useAuthStore()

  const getAllData = async (community: ComputedRef<string>) => {
    data.value = undefined
    await checkAuthOrRedirect(router)
    axios
      .get<TCommunityInfo>(`${BACKEND_API}/getCommunity?term=${community.value}`, {
        headers: { Authorization: 'Bearer ' + authStore.user.token }
      })
      .then((response) => {
        if (response.data) data.value = response.data
      })
      .catch((error) => {
        console.log(error.message)
        data.value = error.response.data
      })
  }

  if (!authStore.isLoggingIn.value) getAllData(community)
  // for some reason params value is undefined on the first run
  watch([community, authStore.isLoggingIn], () => {
    if (!authStore.isLoggingIn.value && community.value) getAllData(community)
  })

  const refetch = () => {
    getAllData(community)
  }
  return { data, refetch }
}

export default useFetchCommunityData
