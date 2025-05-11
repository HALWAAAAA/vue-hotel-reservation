<template>
  <div class="w-full max-w-7xl mx-auto px-4">
    <!-- картка з фільтрами -->
    <div class="relative z-10 flex justify-center">
      <div class="bg-white rounded-lg shadow-lg px-6 py-6 w-full max-w-5xl mb-10">
        <SearchBar />
      </div>
    </div>

    
    <div class="flex flex-col md:flex-row gap-6 mb-10">
      <HotelFilters />

      <div class="flex-1">
        <p class="text-sm text-gray-500 mb-5">
          Showing {{ filteredHotels.length }} results
        </p>
        <HotelList :hotels="filteredHotels" />
      </div>
    </div>
  </div>
</template>м

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchBar from '@/components/ui/MyUi/SearchBar.vue';
import SelectPeople from '@/components/ui/MyUi/SelectPeople.vue';
import HotelFilters from '@/components/user/HotelFilters.vue';
import HotelList from '@/components/user/HotelList.vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/components/firebase';
import { useHotelStore } from '@/store/hotelStore';
import { storeToRefs } from 'pinia';
const store = useHotelStore();
const route = useRoute();
const location = ref('');
const { filteredHotels } = storeToRefs(store);
const total = ref(0);
watch(
  () => route.params.location,
  (loc) => {
    if (loc) {
      store.setLocationSearch(decodeURIComponent(String(loc)).toLowerCase());
    } else {
      store.setLocationSearch('');
    }
  },
  { immediate: true }
);

onMounted(() => {
  store.loadHotels();
});
</script>
