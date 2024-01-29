import { BACKEND_API, checkAuthOrRedirect } from '@/helpers/globalHelpers'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { ref } from 'vue'
import { type Router } from 'vue-router'

export const updateVote = async (
  postId: string,
  type: 'downvote' | 'upvote' | 'remove',
  amount: number,
  router: Router
) => {
  const authStore = useAuthStore()
  await checkAuthOrRedirect(router)
  await axios.post(
    `${BACKEND_API}/setPostVote?term=${postId}&type=${type}&amount=${amount}`,
    {},
    { headers: { Authorization: 'Bearer ' + `${authStore.user.token}` } }
  )
}

export const getVotedPosts = async (router: Router) => {
  const authStore = useAuthStore()
  try {
    await checkAuthOrRedirect(router)
    const votedPosts = await axios.get(`${BACKEND_API}/getVotedPosts`, {
      headers: { Authorization: 'Bearer ' + `${authStore.user.token}` }
    })
    return votedPosts.data.data
  } catch (error) {
    console.log(error)
    return {}
  }
}
