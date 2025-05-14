<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useHotelStore } from '@/store/hotelStore';

import Button from '@/components/ui/button/Button.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Label from '@/components/ui/label/Label.vue';
import { Slider } from '@/components/ui/slider';

const store = useHotelStore();
const { filters, allAmenities } = storeToRefs(store);
</script>

<template>
  <aside class="w-full md:w-64 space-y-6">
    <div>
      <p class="font-semibold mb-2">Price</p>
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>$ 0</span>
        <span>$ {{ filters.priceRange[0] }}</span>
      </div>
      <Slider
        v-model="filters.priceRange"
        :max="5000"
        :step="200"
        class="w-full"
      />
    </div>

    <div>
      <p class="font-semibold mb-2">Rating</p>
      <div class="flex gap-2 flex-wrap">
        <Button
          v-for="r in [0, 1, 2, 3, 4]"
          :key="r"
          class="border px-3 py-1 rounded"
          :variant="r === filters.ratingMin ? 'default' : 'outline'"
          @click="store.setRatingMin(r)"
        >
          {{ r }}+
        </Button>
      </div>
    </div>

    <div>
      <p class="font-semibold mb-2">Amenities</p>
      <div class="space-y-1 text-sm">
        <Label
          v-for="a in allAmenities"
          :key="a"
          class="flex items-center gap-2"
        >
          <Checkbox
            :modelValue="filters.amenities.includes(a)"
            @update:modelValue="store.toggleAmenity(a)"
          />
          {{ a }}
        </Label>
      </div>
    </div>
  </aside>
</template>
