import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { type ComputedRef, ref, watchEffect, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export type TPost = {
  community_id: string
  username: string
  title: string
  content: string
  createdAt: number
  votes: number
  id: string
  numOfComments: number
}
export type TPostInfo = {
  data: TPost[]
  message?: string
}

export const useFetchCommunityPosts = (community: ComputedRef<string>) => {
  const data = ref<TPostInfo | undefined>(undefined)
  const router = useRouter()
  const authStore = useAuthStore()

  const getAllData = async (community: ComputedRef<string>) => {
    await checkAuthOrRedirect(router)

    data.value = undefined
    axios
      .get<TPostInfo>(`${BACKEND_API}/getCommunityPosts?term=${community.value}`, {
        headers: { Authorization: 'Bearer ' + authStore.user.token }
      })
      .then((response) => {
        if (response.data) data.value = response.data
      })
      .catch((error) => (data.value = error.response.data))
  }

  if (!authStore.isLoggingIn.value) getAllData(community)

  watch([community, authStore.isLoggingIn], () => {
    if (!authStore.isLoggingIn.value && community.value) getAllData(community)
  })

  const refetch = () => {
    getAllData(community)
  }

  return { postsData: data, refetch }
}
