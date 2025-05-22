<template>
  <div
    class="border rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row"
  >
    <div
      class="relative w-full md:w-1/3 h-64 md:h-auto bg-gray-200 flex items-center justify-center"
    >
      <Spinner v-if="imgLoading" class="h-8 w-8 text-gray-500" />
      <img
        v-show="!imgLoading"
        :src="hotel.images?.[0] || '/fallback.jpg'"
        class="w-full h-full object-cover"
        @load="imgLoading = false"
        @error="imgLoading = false"
        alt="Hotel image"
      />
    </div>

    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <h3 class="text-lg font-semibold">{{ hotel.name }}</h3>
        <p class="text-sm text-gray-500">Address: {{ hotel.address }}</p>
        <p class="text-sm mt-1">
          ⭐ {{ hotel.rating }} Star Hotel ・ {{ hotel.images?.length || 0 }}+
          Images
        </p>
        <p class="text-sm mt-1 font-medium text-gray-600">
          <span class="font-semibold">{{ hotel.numberOfReviews }}</span> reviews
          <span> max {{ maxGuests }} guests / room </span>
        </p>
      </div>

      <div class="mt-4 flex justify-between items-center">
        <button
          @click="
            auth.user
              ? favStore.toggleFavorite(auth.user.uid, hotel.id)
              : $router.push({ name: USER_LOGIN_NAME })
          "
          class="p-2 text-gray-500 hover:text-black"
        >
          <HeartButton
            :modelValue="isFavorited"
            @update:modelValue="toggleFav"
          />
        </button>
        <div class="text-right">
          <p class="text-sm text-gray-500">starting from</p>
          <p class="text-blue-600 font-semibold text-lg">
            $ {{ hotel.fromPrice }}/night
          </p>
          <RouterLink
            :to="{ name: USER_HOTEL_CARD_NAME, params: { id: hotel.id } }"
            class="mt-2 inline-block px-4 py-1 border rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            View Place
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeartButton from '../ui/MyUi/HeartButton.vue';
import { RouterLink } from 'vue-router';
import Button from '../ui/button/Button.vue';
import { USER_HOTEL_CARD_NAME } from '@/routerPath';
import { computed, ref } from 'vue';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useAuthStore } from '@/store/authStore';
import { USER_LOGIN_NAME } from '@/routerPath';
import router from '@/router';

const props = defineProps({
  hotel: {
    type: Object,
    required: true,
  },
  location: {
    type: String,
    required: false,
    default: 'all',
  },
});
const imgLoading = ref(true);
const maxGuests = computed(() => {
  const rooms = props.hotel.rooms || [];
  return rooms.length > 0 ? Math.max(...rooms.map((r: any) => r.maxGuests)) : 0;
});

const favStore = useFavoriteStore();
const auth = useAuthStore();

const isFavorited = computed(() => favStore.favorites.includes(props.hotel.id));

function toggleFav(modelValue: boolean) {
  if (auth.user && auth.user.uid) {
    favStore.toggleFavorite(auth.user.uid, props.hotel.id);
  } else {
    router.push({ name: USER_LOGIN_NAME });
  }
}
</script>
