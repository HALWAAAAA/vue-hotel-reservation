<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-semibold mb-6">My Favorites</h1>
    <Spinner v-if="loading" />
    <FollowedList v-else-if="hotels.length" :hotels="hotels" />
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch, computed } from 'vue';

import { useAuthStore } from '@/store/authStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useHotelStore } from '@/store/hotelStore';
import FollowedList from '@/components/user/FollowedList.vue';

const auth = useAuthStore();
const favStore = useFavoriteStore();
const hotelStore = useHotelStore();
const hotels = ref<any[]>([]);

function rebuildList() {
  hotels.value = favStore.favorites
    .map((id) => hotelStore.getHotelById(id))
    .filter(Boolean);
}
watch(
  () => unref(auth.user),
  async (u) => {
    if (!u) {
      hotels.value = [];
      return;
    }
    await favStore.loadFavorites(u.uid);
    await hotelStore.loadHotelsByIds(favStore.favorites);
    rebuildList();
  },
  { immediate: true }
);

watch(() => favStore.favorites.slice(), rebuildList);
const loading = computed(() => favStore.loading || hotelStore.loading);
</script>
