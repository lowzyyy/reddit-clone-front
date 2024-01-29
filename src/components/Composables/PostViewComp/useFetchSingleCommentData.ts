import { ref, type ComputedRef, type Ref, watchEffect, watch } from 'vue'
import axios from 'axios'
import type { TSort } from '@/components/PostView/CommentSection/helpers'
import type { TCommentWSubcomment } from './useFetchCommentsData'
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

export const useFetchSingleCommentData = (commentId: ComputedRef<string>, sort: Ref<TSort>) => {
  const authStore = useAuthStore()
  const router = useRouter()

  const data = ref<TCommentWSubcomment[] | undefined | null>(undefined)

  const getAllData = async (commentId: ComputedRef<string>, sort: Ref<TSort>) => {
    await checkAuthOrRedirect(router)
    axios
      .get<{ data: TCommentWSubcomment[] | null }>(
        `${BACKEND_API}/getComment?commentId=${commentId.value}&sortType=${sort.value}`,
        {
          headers: { Authorization: 'Bearer ' + authStore.user.token }
        }
      )
      .then((response) => {
        data.value = response.data.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
  getAllData(commentId, sort)

  watch([commentId, sort], () => {
    getAllData(commentId, sort)
  })

  const refetch = () => getAllData(commentId, sort)

  return { data, refetch }
}
