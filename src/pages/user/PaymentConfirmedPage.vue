<template>
  <div class="payment-confirmed-page text-center py-20">
    <h1 class="text-3xl font-semibold text-green-600 mb-4">Payment Successful!</h1>
    <p class="text-lg text-gray-700 mb-8">Your booking is confirmed. Thank you for choosing our service!</p>
    <div class="mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <Button @click="goToHomeAndStopCountdown" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
      Go to Homepage
    </Button>
    <p class="mt-4 text-sm text-gray-500">You will be automatically redirected to the homepage in {{ remaining }} seconds...</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCountdown } from '@vueuse/core';
import Button from '@/components/ui/button/Button.vue';
import { USER_HOME_NAME } from '@/routerPath';

const router = useRouter();

const goToHome = () => {
  router.push({ name: USER_HOME_NAME });
};

const { remaining, start, stop, isActive } = useCountdown(10, {
  onComplete: () => {
    goToHome();
  },
});

const goToHomeAndStopCountdown = () => {
  if (isActive.value) {
    stop();
  }
  goToHome();
};


start();

</script>


