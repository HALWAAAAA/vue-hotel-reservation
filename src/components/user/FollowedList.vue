<template>
  <div class="space-y-6 mb-5">
    <p v-if="props.hotels.length === 0" class="text-center text-gray-500">No favorites yet.</p>
    <div v-else>
      <HotelCard
        v-for="hotel in props.hotels"
        :key="hotel.id"
        :hotel="hotel"
        :location="undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

import HotelCard from './HotelCard.vue';

const props = defineProps<{
  hotels: Array<any>;
    
}>();
</script>
