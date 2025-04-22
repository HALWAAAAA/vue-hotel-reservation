<template>
  <div>
    <component :is="isHome ? HeaderUser : HeaderMain" :key="route.name" />

    <router-view />

    <Footer />
  </div>
</template>

<script setup>
import Home from '@/pages/user/Home.vue';
import HeaderMain from '@/components/user/HeaderMain.vue';
import HeaderUser from '@/components/user/HeaderUser.vue';
import { useRoute } from 'vue-router';
import Footer from '@/components/user/Footer.vue';
import { computed } from 'vue';

const route = useRoute();
const isHome = computed(() => route?.name === 'HomeUser');
</script>
