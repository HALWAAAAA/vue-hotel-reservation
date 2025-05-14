<template>
  <div v-if="amenitiesToShow.length" class="border-t pt-8 mt-8">
    <h2 class="text-xl font-semibold mb-4">Amenities</h2>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm"
    >
      <div
        v-for="amenity in amenitiesToShow"
        :key="amenity"
        class="flex items-center space-x-2"
      >
        <Icon
          :icon="amenityIcons[amenity] || fallbackIcon"
          class="text-green-700 text-lg flex-shrink-0"
        />
        <span class="text-gray-700">{{ amenity }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{ amenities: string[] | undefined }>();

const amenitiesToShow = computed(() => props.amenities ?? []);

const amenityIcons: Record<string, string> = {
  'Free Wi-Fi': 'mdi:wifi',
  'Free breakfast': 'mdi:coffee-outline',
  'Free parking': 'mdi:parking',
  '24hr front desk': 'mdi:desk',
  'Swimming pool': 'mdi:pool',
  'Air conditioning': 'mdi:air-conditioner',
  'Fitness center': 'mdi:dumbbell',
  'Room service': 'mdi:room-service-outline',
  'Tea/Coffee maker': 'mdi:coffee-maker-outline',
  Restaurant: 'mdi:silverware-fork-knife',
  Bar: 'mdi:glass-cocktail',
  Spa: 'mdi:spa-outline',
  'Non-smoking rooms': 'mdi:smoke-off',
  'Pet friendly': 'mdi:dog',
  'Paid breakfast': 'mdi:coffee-outline',
  'Paid parking': 'mdi:parking',
  'Business center': 'mdi:briefcase-outline',
  'Child friendly': 'mdi:human-baby-changing-table',
  Laundry: 'mdi:washing-machine',
};
const fallbackIcon = 'mdi:check-circle-outline';
</script>
