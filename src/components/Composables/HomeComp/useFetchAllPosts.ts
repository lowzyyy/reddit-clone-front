import { useAuthStore } from '@/stores/authStore'
import { ref, toRaw, watch } from 'vue'
import type { TPostInfo } from '../CommunityViewComp/useFetchCommunityPosts'
import axios from 'axios'
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useRouter } from 'vue-router'

export const useFetchAllPosts = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const data = ref<
    (TPostInfo & { topCommunities: { name: string; members: number }[] | null }) | undefined
  >(undefined)

  const getAllData = async () => {
    await checkAuthOrRedirect(router)
    axios
      .get(`${BACKEND_API}/getAllPosts`, {
        headers: { Authorization: 'Bearer ' + authStore.user.token, 'Cache-Control': 'no-cache' }
      })
      .then((response) => {
        data.value = response.data
      })
      .catch((err) => {
        console.log(`Error GET ALL POSTST: ${err.response.data.message}`)
        data.value = err.response.data
      })
  }
  watch(authStore.isLoggingIn, () => {
    if (!authStore.isLoggingIn.value) getAllData()
  })
  // getAllData()
  if (!authStore.isLoggingIn.value) getAllData()

  const refetch = () => getAllData()

  return { data, refetch }
}
