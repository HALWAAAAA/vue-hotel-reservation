<template>
  <div
    class="border rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row"
  >
    <img
      :src="hotel.images?.[0] || '/fallback.jpg'"
      class="w-full md:w-1/3 h-full object-cover"
    />

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
        </p>
        <p class="text-sm text-gray-500">
          Free Cancellation Up to 24h: {{ hotel.freeCancellationUpto24h }}
        </p>
      </div>

      <div class="mt-4 flex justify-between items-center">
        <button class="p-2 border rounded text-gray-500 hover:text-black">
          ❤️
        </button>
        <div class="text-right">
          <p class="text-sm text-gray-500">starting from</p>
          <p class="text-blue-600 font-semibold text-lg">
            $ {{ hotel.rooms[0].basePrice }}/night
          </p>
          <button class="mt-2 px-4 py-1 border rounded bg-blue-600 text-white">
            View Place
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '../ui/button/Button.vue';
defineProps({
  hotel: {
    type: Object,
    required: true,
  },
});
</script>
