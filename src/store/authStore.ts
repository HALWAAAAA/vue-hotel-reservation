// src/store/authStore.ts
import { defineStore } from 'pinia'
import { useCurrentUser } from 'vuefire'
import { computed, ref, watch } from 'vue'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/components/firebase'
import router from '@/router'
import {
  USER_HOME_NAME,
} from '@/routerPath'
import { useFavoriteStore } from './favoriteStore'

export const useAuthStore = defineStore('auth', () => {
  const user = useCurrentUser()
  const loading = ref(true)   
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin    = ref(false)

  const fav = useFavoriteStore()

  
  onAuthStateChanged(auth, (u) => {
    user.value = u
    loading.value = false 
    if (u) fav.loadFavorites(u.uid)
  })

  function setAdmin(flag: boolean) {
    isAdmin.value = flag
  }

  async function logout() {
    try {
      await signOut(auth)
      isAdmin.value = false
      router.push({ name: USER_HOME_NAME })
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return {
    user,
    loading, 
    isLoggedIn,
    isAdmin,
    logout,
    setAdmin
  }
})
