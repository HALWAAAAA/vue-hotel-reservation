<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from './layouts/AdminLayout.vue';
import UserLayout from './layouts/UserLayout.vue';
import Toaster from '@/components/ui/toast/Toaster.vue';

const route = useRoute();

const layout = computed(() => route.meta.layout || 'user');
</script>

<template>
  <component :is="layout === 'admin' ? AdminLayout : UserLayout" />
  <Toaster />
</template>
