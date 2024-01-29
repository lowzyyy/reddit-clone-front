import { BACKEND_API } from '@/helpers/globalHelpers'
import axios from 'axios'
import { ref } from 'vue'

export const useFetchVotes = (id: string, type: 'Post' | 'Comment') => {
  const data = ref<{ data: { votes: number }; message?: string } | undefined>(undefined)
  const refetch = () => {
    axios
      .get(`${BACKEND_API}/get${type}Votes?term=${id}`, {})
      .then((response) => {
        data.value = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return { data, refetch }
}
