import type { InjectionKey } from 'vue'
import { initializeApp } from 'firebase/app'
import { setPersistence, browserSessionPersistence, getAuth } from 'firebase/auth'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, type Router } from 'vue-router'

export const initFirebaseAndRealtimeDB = async () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyDJ7lXfiammlSvM_LM6cBeUdN3MZ4JZvJ8',
    authDomain: 'reddit-clone-db-c009e.firebaseapp.com',
    databaseURL: 'https://reddit-clone-db-c009e-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'reddit-clone-db-c009e',
    storageBucket: 'reddit-clone-db-c009e.appspot.com',
    messagingSenderId: '320081472174',
    appId: '1:320081472174:web:1dbcab18bdfbc8edc1db3f',
    measurementId: 'G-017CM2SBS7'
  }

  // Initialize Firebase
  initializeApp(firebaseConfig)
  const auth = getAuth()
  await setPersistence(auth, browserSessionPersistence)
}

export const formatPostedTime = (postTime: number) => {
  const nowTime = new Date().getTime()
  const diffTime = nowTime - postTime
  if (diffTime < 86_400_000) {
    if (diffTime < 3_600_000) {
      const passedTime = Math.round(diffTime / 60_000)
      return passedTime + (passedTime === 1 ? ' min ago' : ' mins ago')
    } else {
      const passedTime = Math.round(diffTime / 3_600_000)
      return passedTime + (passedTime === 1 ? ' hour ago' : ' hours ago')
    }
  } else {
    const passedTime = Math.round(diffTime / 86_400_000)
    return passedTime + (passedTime === 1 ? ' day ago' : ' days ago')
  }
}

// export const DB_API = 'https://reddit-clone-db-c009e-default-rtdb.europe-west1.firebasedatabase.app'
// export const BACKEND_API = 'http://localhost:3110'
export const BACKEND_API = 'https://reddit-back.up.railway.app'

// ############### IMAGES
export const bannerSize: { [key: string]: string } = {
  small: '128px',
  medium: '192px',
  large: '250px'
}

export const rndNumber = () => (Math.random() * 100).toFixed(2)

export const checkImage = async (imgUrl: string): Promise<boolean> => {
  if (!imgUrl) {
    return false
  }
  return new Promise((res) => {
    const image = new Image()
    image.onload = () => res(true)
    image.onerror = () => res(false)
    image.src = imgUrl
  })
}
// ############### END IMAGES

// symbols for provide/inject
export const refetchCommentsKey: InjectionKey<() => void> = Symbol('refetch-comments')

export const postIdKey: InjectionKey<string> = Symbol('post-id')

// add red border for invalid input element handler
export const focusHandler = (e: any) => (e.target as HTMLInputElement).classList.add('redborder')

export const checkAuthOrRedirect = async (router: Router) => {
  const authStore = useAuthStore()

  if (
    !authStore.isLoggingIn.value &&
    authStore.authenticated &&
    new Date().getTime() > authStore.user.expiresIn
  ) {
    authStore.clearState()
    await router.push({ name: 'login' })
  }
}
