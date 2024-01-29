import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { useRouter, type Router } from 'vue-router'

export type TSort = 'newest' | 'oldest' | 'top'

export const updateVote = async (
  postId: string,
  type: 'downvote' | 'upvote' | 'remove',
  amount: number,
  router: Router
) => {
  const authStore = useAuthStore()
  await checkAuthOrRedirect(router)
  await axios.post(
    `${BACKEND_API}/setCommentVote?term=${postId}&type=${type}&amount=${amount}`,
    {},
    { headers: { Authorization: 'Bearer ' + `${authStore.user.token}` } }
  )
}

export const getVotedComments = async (router: Router) => {
  const authStore = useAuthStore()
  try {
    await checkAuthOrRedirect(router)
    const votedComments = await axios.get(`${BACKEND_API}/getVotedComments`, {
      headers: { Authorization: 'Bearer ' + `${authStore.user.token}` }
    })
    return votedComments.data.data
  } catch (error) {
    console.log(error)
    return {}
  }
}
