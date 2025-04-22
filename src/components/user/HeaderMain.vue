<template>
  <header
    class="w-full bg-cyan-700 px-8 py-4 flex items-center justify-between shadow-md"
  >
    <RouterLink :to="USER_HOME_ROUTE">
      <h2 class="text-white text-2xl font-semibold flex items-center gap-1">
        Hotel
        <span
          class="bg-white text-cyan-700 px-2 py-1 rounded-md text-base font-bold"
          >hub</span
        >
      </h2>
    </RouterLink>
    <nav class="flex items-center space-x-8 text-white font-medium text-base">
      <span class="hover:text-white/80 transition cursor-pointer"
        >About Us</span
      >
      <span class="hover:text-white/80 transition cursor-pointer"
        >Contact Us</span
      >
      <span class="hover:text-white/80 transition cursor-pointer">Log In</span>
      <Button
        class="bg-white text-cyan-700 font-semibold px-5 py-2 rounded-md hover:bg-white/90 transition shadow-sm"
      >
        Sign Up
      </Button>
    </nav>
  </header>
</template>

<script setup>
import Button from '@/components/ui/button/Button.vue';
import { HOME_ROUTE, USER_HOME_ROUTE } from '@/routerPath';
</script>
