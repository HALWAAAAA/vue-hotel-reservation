import { defineStore } from 'pinia';

import { computed, ref, watch } from 'vue';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/components/firebase';

import { USER_HOME_NAME } from '@/routerPath';
import { useFavoriteStore } from './favoriteStore';
let router: any;
export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null);
  const loading = ref(true);
  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = ref(false);

  const fav = useFavoriteStore();

  onAuthStateChanged(auth, (u) => {
    user.value = u;
    loading.value = false;
    if (u) fav.loadFavorites(u.uid);
  });

  function setAdmin(flag: boolean) {
    isAdmin.value = flag;
  }

  async function logout() {
    if (!router) router = (await import('@/router')).default;
    try {
      await signOut(auth);
      isAdmin.value = false;
      router.push({ name: USER_HOME_NAME });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return {
    user,
    loading,
    isLoggedIn,
    isAdmin,
    logout,
    setAdmin,
  };
});
