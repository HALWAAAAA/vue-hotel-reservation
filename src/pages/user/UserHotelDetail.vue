<template>
  <div class="max-w-screen-2xl mx-auto px-4 mt-5 mb-5">
    <div v-if="hotel">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
      >
        <div>
          <h1 class="text-2xl font-bold">{{ hotel.name }}</h1>
          <p class="text-sm text-gray-600">📍 {{ hotel.area }}</p>
          <div class="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <span class="text-blue-600 font-semibold">{{ hotel.rating }}</span>
            ★
            <span>{{ hotel.numberOfReviews }} reviews</span>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <p class="text-blue-600 text-xl font-semibold">
            ₹ {{ hotel.rooms?.[0]?.basePrice || '---'
            }}<span class="text-sm">/night</span>
          </p>
          <div class="flex gap-2">
            <Button
              class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Book now
            </Button>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10 max-w-6xl mx-auto"
      >
        <div
          class="lg:col-span-2 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden"
          style="height: 400px"
        >
          <img
            :src="mainImage"
            class="max-h-full max-w-full object-contain"
            alt="Main hotel image"
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <img
            v-for="(img, index) in imageList.slice(1, 5)"
            :key="index"
            :src="img"
            @click="swapImages(index + 1)"
            class="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-75 transition"
            alt="Hotel image"
          />
        </div>
      </div>

      <div class="border-t pt-8 mt-8">
        <h2 class="text-xl font-semibold mb-4">Overview</h2>
        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
          {{ hotel.description }}
        </p>
      </div>

      <div class="border-t pt-8 mt-8">
        <h2 class="text-xl font-semibold mb-4">Available Rooms</h2>
        <div class="space-y-4">
          <div
            v-for="(room, index) in hotel.rooms?.filter((r) => r.available)"
            :key="index"
            class="flex flex-col md:flex-row items-center justify-between gap-4 border rounded-lg p-4 shadow-sm"
          >
            <img
              :src="room.images?.[0] || '/fallback.jpg'"
              class="w-full md:w-24 h-24 object-cover rounded-md"
              alt="Room image"
            />
            <div class="flex-1 w-full md:ml-4">
              <p class="font-medium">{{ room.accommodationType }}</p>
              <p class="text-sm text-gray-500">
                Room Type: {{ room.type }} ・ {{ room.roomArea }} m²
              </p>
            </div>
            <div class="text-right">
              <p class="text-blue-600 font-semibold text-lg">
                zł {{ room.basePrice }}
                <span class="text-sm text-gray-500">/night</span>
              </p>
              <Button
                class="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
              >
                Book now
              </Button>
            </div>
          </div>
          <div class="border-t pt-8 mt-8">
            <h2 class="text-xl font-semibold mb-4">Location / Map</h2>
            <HotelMap
              :lat="parseFloat(hotel.lat)"
              :lng="parseFloat(hotel.lng)"
              :name="hotel.name"
            />
            <div
              class="flex flex-col md:flex-row items-start md:items-center justify-between mt-4"
            >
              <p class="text-sm text-gray-600">
                📍 {{ hotel.address || 'Address not available' }}
              </p>
              <a
                class="mt-2 md:mt-0 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                :href="`https://www.google.com/maps/search/?api=1&query=${hotel.lat},${hotel.lng}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Maps
              </a>
            </div>
            <AmenitiesList :amenities="hotel.amenities" />
            <ReviewsSection class="mb-10" />
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <p>Loading hotel...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useHotelStore } from '@/store/hotelStore';
import HotelMap from '@/components/ui/MyUi/HotelMap.vue';
import AmenitiesList from '@/components/ui/MyUi/AmenitiesList.vue';
import ReviewsSection from '@/components/ui/MyUi/ReviewsSection.vue';
import Button from '@/components/ui/button/Button.vue';

const route = useRoute();
const store = useHotelStore();
const hotel = ref(null);
const mainImage = ref('');
const imageList = ref([]);
async function loadHotelData(id) {
  const data = store.getHotelById(id) || (await store.fetchHotelById(id));
  hotel.value = data;
  imageList.value = data?.images || [];
  mainImage.value = imageList.value[0] || '/fallback.jpg';
}

onMounted(() => {
  loadHotelData(route.params.id);
});

onBeforeRouteUpdate((to, from, next) => {
  loadHotelData(to.params.id);
  next();
});

function swapImages(index) {
  const temp = mainImage.value;
  mainImage.value = imageList.value[index];
  imageList.value[index] = temp;
}
</script>
