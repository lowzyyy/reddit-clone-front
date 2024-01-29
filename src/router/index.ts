import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import CommunityView from '@/views/CommunityView.vue'
import CreateCommunityView from '@/views/CreateCommunityView.vue'
import PostView from '@/views/PostView.vue'
import PostViewWithComments from '@/views/PostViewWithComments.vue'
import PostWithPrunedComments from '@/views/PostWithPrunedComments.vue'
import LogIn from '@/components/LoginView/LogIn.vue'
import SignUp from '@/components/LoginView/SignUp.vue'
import FinishSignup from '@/components/LoginView/FinishSignup.vue'
import ResetPassword from '@/components/LoginView/ResetPassword.vue'
import FinishResetPassword from '@/components/LoginView/FinishResetPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth',
      name: 'auth',
      component: LoginView,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LogIn
        },
        {
          path: 'signup',
          name: 'signup',
          component: SignUp
        },
        { path: 'finishSignup', name: 'finishsignup', component: FinishSignup },
        {
          path: 'resetPassword',
          name: 'resetpassword',
          component: ResetPassword
        },
        { path: 'finishResetPassword', name: 'finishresetassword', component: FinishResetPassword }
      ]
    },
    {
      path: '/r/:communityName',
      name: 'communityview',
      component: CommunityView
    },
    {
      path: '/r/:communityName/:postId',
      name: 'postview',
      component: PostView,
      children: [
        {
          path: '',
          name: 'postview with comments',
          component: PostViewWithComments
        },
        {
          path: 'comment/:commentId',
          name: 'postview with pruned comments',
          component: PostWithPrunedComments
        }
      ]
    },

    {
      path: '/createCommunity',
      name: 'createCommunity',
      component: CreateCommunityView
    }
  ]
})

export default router
