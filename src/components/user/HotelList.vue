<template>
  <div class="space-y-6 mb-5">
    <HotelCard v-for="hotel in hotels" :key="hotel.id" :hotel="hotel" />
  </div>
</template>

<script setup>
import HotelCard from './HotelCard.vue';

defineProps({
  hotels: {
    type: Array,
    required: true,
  },
});
</script>
