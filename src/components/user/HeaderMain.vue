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

    <nav class="flex items-center space-x-6">
      <template v-if="!auth.isLoggedIn">
        <RouterLink
          :to="{ name: USER_LOGIN_NAME }"
          class="hover:text-white/80 transition"
        >
          Log In
        </RouterLink>

        <RouterLink
          :to="{ name: USER_REGISTER_NAME }"
          class="bg-white text-cyan-700 font-semibold px-5 py-2 rounded-md hover:bg-white/90 transition shadow-sm inline-block"
        >
          Sign Up
        </RouterLink>
      </template>

      <Button
        v-else
        @click="auth.logout"
        class="bg-white text-cyan-700 font-semibold px-5 py-2 rounded-md hover:bg-white/90 transition shadow-sm"
      >
        Sign Out
      </Button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { useAuthStore } from '@/store/authStore';
import {
  USER_HOME_NAME,
  USER_HOME_ROUTE,
  USER_LOGIN_NAME,
  USER_LOGIN_ROUTE,
  USER_REGISTER_NAME,
} from '@/routerPath';

const auth = useAuthStore();
</script>
