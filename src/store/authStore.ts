// src/stores/auth.ts
import { defineStore } from 'pinia';
import { useCurrentUser } from 'vuefire';
import { computed } from 'vue';
import { signOut } from 'firebase/auth';
import { auth } from '@/components/firebase';
import router from '@/router';
import {
  USER_HOME_NAME,
  USER_REGISTER_NAME,
  HOME_ROUTE,
  USER_HOME_ROUTE,
} from '@/routerPath';

export const useAuthStore = defineStore('auth', () => {
  const user = useCurrentUser();

  const isLoggedIn = computed(() => !!user.value);

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const isAdmin = computed(() => user.value?.email === ADMIN_EMAIL);

  async function logout() {
    try {
      await signOut(auth);

      router.push({ name: USER_HOME_NAME });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    logout,
  };
});
