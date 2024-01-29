import type { TSort } from '@/components/PostView/CommentSection/helpers'
import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { ref, type ComputedRef, type Ref, watchEffect, watch } from 'vue'
import { useRouter } from 'vue-router'

export type TCommentWSubcomment = TComment & { isOwner: boolean; level: number } & {
  subComments: TCommentWSubcomment[] | null
}

export type TComment = {
  id: string
  parent_id: string | null
  post_id: string
  owner_id: string
  have_avatar: boolean
  username: string
  content: string
  createdAt: number
  votes: number
}

export const useFetchCommentsData = (postId: ComputedRef<string>, sort: Ref<TSort>) => {
  const authStore = useAuthStore()
  const router = useRouter()

  const data = ref<TCommentWSubcomment[] | undefined | null>(undefined)

  const getAllData = async (postId: ComputedRef<string>, sort: Ref<TSort>) => {
    await checkAuthOrRedirect(router)
    axios
      .get<{ data: TCommentWSubcomment[] | null }>(
        `${BACKEND_API}/getPostComments?postId=${postId.value}&sortType=${sort.value}`,
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
  getAllData(postId, sort)

  watch([postId, sort], () => {
    getAllData(postId, sort)
  })

  const refetch = () => getAllData(postId, sort)

  return { data, refetch }
}
