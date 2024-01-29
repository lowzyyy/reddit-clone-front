import { ref, type ComputedRef } from 'vue'
import type { TPost } from '../CommunityViewComp/useFetchCommunityPosts'
import axios, { AxiosError } from 'axios'
import { BACKEND_API } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'

export type TPostData = {
  data: TPost
  isOwner: boolean
}

const useFetchPostData = (postId: ComputedRef<string>) => {
  const data = ref<TPostData | undefined>(undefined)
  const authStore = useAuthStore()

  const getAllData = () => {
    axios
      .get(`${BACKEND_API}/getCommunityPost?postId=${postId.value}`, {
        headers: { Authorization: 'Bearer ' + authStore.user.token }
      })
      .then((response) => {
        data.value = response.data
      })
      .catch((error) => {
        if (error instanceof AxiosError) data.value = error.response?.data
      })
  }
  getAllData()

  const refetch = () => getAllData()

  return { data }
}

export default useFetchPostData
