import { ref, watch } from 'vue'
import axios from 'axios'
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const useFetchJoinedCommunities = () => {
  const data = ref<string[] | undefined>(undefined)
  const authStore = useAuthStore()
  const router = useRouter()
  const getAllData = async () => {
    data.value = undefined
    await checkAuthOrRedirect(router)
    axios
      .get(`${BACKEND_API}/getJoinedCommunities`, {
        headers: { Authorization: 'Bearer ' + `${authStore.user.token}` }
      })
      .then((response) => {
        if (response.data.data.length !== 0) data.value = response.data.data.sort()
        else data.value = response.data.data
      })
      .catch((error) => {
        data.value = []
        // if (error.response.data.message === 'Invalid token!!!') {
        //   authStore.clearState()
        //   router.push({ name: 'login' })
        // }
      })
  }
  watch(authStore.isLoggingIn, () => {
    if (!authStore.isLoggingIn.value) getAllData()
  })

  const refetch = () => {
    getAllData()
  }

  return { data, refetch }
}

export default useFetchJoinedCommunities
