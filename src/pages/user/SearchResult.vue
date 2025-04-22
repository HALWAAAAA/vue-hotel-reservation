<template>
  <div class="w-full max-w-7xl mx-auto px-4">
    <div
      class="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4"
    >
      <div
        class="bg-white rounded-lg shadow-lg px-6 py-6 flex flex-col gap-4 text-gray-800 w-full max-w-4xl"
      >
        <div class="flex flex-wrap md:flex-nowrap gap-4 w-full">
          <div class="flex flex-col flex-1 min-w-[200px]">
            <Label for="location" class="font-medium mb-3.5">Location</Label>
            <Input
              type="text"
              id="location"
              placeholder="Where are you going?"
              class="px-4 py-2 rounded border"
              v-model="location"
            />
          </div>
          <div class="flex flex-col flex-1 min-w-[200px]">
            <Label for="dates" class="font-medium mb-3.5">Dates</Label>
            <PickDate id="dates" />
          </div>
          <div class="flex flex-col flex-1 min-w-[200px]">
            <label class="font-medium mb-1" for="guests">Guests</label>
            <SelectPeople id="guests" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-6 mt-10">
      <HotelFilters />

      <div class="flex-1">
        <p class="text-sm text-gray-500 mb-5">
          Showing {{ hotels.length }} results
        </p>
        <HotelList :hotels="hotels" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PickDate from '@/components/ui/MyUi/PickDate.vue';
import SelectPeople from '@/components/ui/MyUi/SelectPeople.vue';
import HotelFilters from '@/components/user/HotelFilters.vue';
import HotelList from '@/components/user/HotelList.vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/components/firebase';

const location = ref('');
const hotels = ref([]);
const total = ref(0);

onMounted(async () => {
  const snapshot = await getDocs(collection(db, 'hotels'));
  hotels.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
});
</script>
