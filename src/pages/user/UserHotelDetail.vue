<template>
  <div class="max-w-screen-2xl mx-auto px-4 mt-5 mb-5">
    <div v-if="loading" class="text-center py-20">Loading hotel...</div>
    <div v-else-if="hotel">
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
            zł {{ hotel.rooms?.[0]?.basePrice || '---'
            }}<span class="text-sm">/night</span>
          </p>
          <div class="flex gap-2"></div>
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
        <div v-if="allFullyBooked" class="py-6 text-center text-red-500">
          На жаль, у ці дати немає вільних кімнат
        </div>
        <div class="space-y-4">
          <div
            v-for="room in displayRooms"
            :key="room.id"
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
                @click="goToBooking(room)"
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
            <ReviewsSection class="mb-10" :hotelId="route.params.id" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20">Hotel not found.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useHotelStore } from '@/store/hotelStore';
import { useAuthStore } from '@/store/authStore';
import HotelMap from '@/components/ui/MyUi/HotelMap.vue';
import AmenitiesList from '@/components/ui/MyUi/AmenitiesList.vue';
import ReviewsSection from '@/components/ui/MyUi/ReviewsSection.vue';
import Button from '@/components/ui/button/Button.vue';
import { USER_BOOK_NAME } from '@/routerPath';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/components/firebase';
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const store = useHotelStore();
const hotel = ref<any | null>(null);

const mainImage = ref('');
const imageList = ref<string[]>([]);
const loading = ref(true);
const bookingRoom = ref(null);
const showBookingForm = ref(false);
const bookedRoomIds = ref<Set<string>>(new Set());

const desiredStart = computed(() => store.filters.startDate);
const desiredEnd = computed(() => store.filters.endDate);
const bookings = ref<{ roomId: string; startDate: string; endDate: string }[]>(
  []
);

async function loadHotelData(id: string) {
  loading.value = true;
  const data = store.getHotelById(id) || (await store.fetchHotelById(id));
  hotel.value = data;

  const snap = await getDocs(
    query(collection(db, 'bookings'), where('hotelId', '==', id))
  );
  bookings.value = snap.docs.map((d) => {
    const b: any = d.data();
    return { roomId: b.roomId, startDate: b.startDate, endDate: b.endDate };
  });

  imageList.value = data?.images || [];
  mainImage.value = imageList.value[0] || '/fallback.jpg';
  loading.value = false;
}

onMounted(() => {
  loadHotelData(route.params.id as string);
});

onBeforeRouteUpdate(async (to, from, next) => {
  loadHotelData(to.params.id as string).then(() => next());
});

function swapImages(index: number) {
  const temp = mainImage.value;
  mainImage.value = imageList.value[index];
  imageList.value[index] = temp;
}

function goToBooking(room: any) {
  if (!authStore.isLoggedIn) {
    return router.push({ name: 'Login' });
  }
  const loc = (route.params.location as string) || store.filters.startDate;
  router.push({
    name: USER_BOOK_NAME,
    params: {
      location: loc,
      hotelId: route.params.id,
      roomId: room.id,
    },
  });
}

const displayRooms = computed(() => {
  const rooms = hotel.value?.rooms ?? [];
  if (!desiredStart.value || !desiredEnd.value) {
    return rooms;
  }
  return rooms.filter((r: any) => {
    if (r.startDate && r.endDate) {
      if (desiredStart.value < r.startDate || desiredEnd.value > r.endDate) {
        return false;
      }
    }
    const roomBookings = bookings.value.filter((b) => b.roomId === r.id);
    for (const b of roomBookings) {
      const overlap = !(
        desiredEnd.value <= b.startDate || desiredStart.value >= b.endDate
      );
      if (overlap) return false;
    }
    return true;
  });
});

const allFullyBooked = computed(() => displayRooms.value.length === 0);
</script>
