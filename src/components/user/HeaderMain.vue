<template>
  <header
    class="w-full bg-cyan-700 px-8 py-4 flex items-center justify-between shadow-md"
  >
    <RouterLink
      :to="{ name: USER_HOME_NAME }"
      class="text-white text-2xl font-semibold"
    >
      Hotel<span class="bg-white text-cyan-700 px-2 py-1 rounded-md ml-1"
        >hub</span
      >
    </RouterLink>

    <div v-if="auth.loading" class="flex items-center">
      <Spinner class="h-6 w-6" />
    </div>
    
    <nav class="flex items-center space-x-6">
      <template v-if="!auth.isLoggedIn">
        <RouterLink
          :to="{ name: USER_LOGIN_NAME }"
          class="hover:text-cyan-300 transition cursor-pointer text-white"
        >
          Log In
        </RouterLink>

        <RouterLink
          :to="{ name: USER_REGISTER_NAME }"
          class="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-white/90 transition shadow-sm inline-block"
        >
          Sign Up
        </RouterLink>
      </template>

      <template v-else>
        <RouterLink
          :to="{ name: USER_PROFILE_NAME }"
          class="hover:text-cyan-300 transition cursor-pointer text-white"
        >
          Profile
        </RouterLink>

        <RouterLink
          :to="{ name: USER_FOLLOWED_NAME }"
          class="hover:text-cyan-300 transition cursor-pointer text-white"
        >
          Followed
        </RouterLink>
        <Button
          @click="auth.logout"
          class="bg-white text-cyan-700 font-semibold px-5 py-2 rounded-md hover:bg-white/90 transition shadow-sm"
        >
          Sign Out
        </Button>
      </template>
    </nav>
  </header>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { useAuthStore } from '@/store/authStore';
import {
  USER_HOME_NAME,
  USER_FOLLOWED_NAME,
  USER_LOGIN_NAME,
  USER_PROFILE_NAME,
  USER_REGISTER_NAME,
} from '@/routerPath';

const auth = useAuthStore();
</script>
