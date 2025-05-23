<template>
  <div
    class="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6"
  >
    <div v-if="loading" class="text-center py-20">Loading hotel...</div>
    <div v-else-if="hotel">
      <div class="lg:col-span-2 space-y-6">
        <div class="p-6 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-2">
            {{ room.accommodationType }}
          </h2>
          <p class="text-gray-600 mb-4">{{ hotel.name }} ・ {{ room.type }}</p>
          <p class="text-gray-800">
            zł {{ room.basePrice
            }}<span class="text-sm text-gray-500">/night</span>
          </p>
        </div>

        <div
          class="p-6 bg-white rounded-lg shadow flex flex-col md:flex-row gap-4 items-center"
        >
          <div class="flex-1">
            <label class="block text-sm text-gray-700 mb-1">Check-In</label>
            <input
              type="date"
              v-model="startDate"
              :min="room.startDate"
              :max="room.endDate"
              class="w-full border rounded px-3 py-2"
            />
          </div>
          <div class="flex-none text-gray-500">→</div>
          <div class="flex-1">
            <label class="block text-sm text-gray-700 mb-1">Check-Out</label>
            <input
              type="date"
              v-model="endDate"
              :min="room.startDate"
              :max="room.endDate"
              class="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div class="p-6 bg-white rounded-lg shadow flex items-center gap-4">
          <div>
            <p class="text-sm text-gray-600">Nights</p>
            <p class="font-semibold">{{ nights }}</p>
          </div>
          <div class="border-l h-8"></div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Guests</label>
            <input
              v-model.number="guests"
              type="number"
              min="1"
              class="w-16 border rounded px-2 py-1"
            />
          </div>
        </div>

        <p v-if="!noOverlap && startDate && endDate" class="text-red-500">
          These dates are partially booked by another reservation. Please choose
          a different time interval.
        </p>

        <Button
          @click="book"
          :disabled="!canBook"
          class="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          Pay in full
        </Button>
      </div>

      <div class="space-y-6">
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4">Price Details</h3>
          <dl class="space-y-2 text-sm text-gray-700">
            <div class="flex justify-between">
              <dt>Base Fare</dt>
              <dd>zł {{ room.basePrice }} × {{ nights }} night(s)</dd>
            </div>
            <div class="flex justify-between">
              <dt>Discount</dt>
              <dd>zł 0</dd>
            </div>
            <div class="flex justify-between">
              <dt>Taxes</dt>
              <dd>zł {{ tax }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Fee</dt>
              <dd>zł {{ fee }}</dd>
            </div>
            <hr />
            <div class="flex justify-between font-semibold">
              <dt>Total</dt>
              <dd>zł {{ total }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20">Hotel not found.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHotelStore } from '@/store/hotelStore';
import { useAuthStore } from '@/store/authStore';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/components/firebase';
import { USER_HOME_NAME, USER_LOGIN_NAME } from '@/routerPath';
import Button from '@/components/ui/button/Button.vue';

const route = useRoute();
const router = useRouter();
const hotelStore = useHotelStore();
const authStore = useAuthStore();

const hotelId = route.params.hotelId as string;
const roomId = route.params.roomId as string;

const hotel = ref<any>(null);
const room = ref<any>({});
const startDate = ref('');
const endDate = ref('');
const guests = ref(1);
const loading = ref(true);
const bookings = ref<{ startDate: string; endDate: string }[]>([]);

async function load() {
  loading.value = true;
  const data =
    hotelStore.getHotelById(hotelId) ||
    (await hotelStore.fetchHotelById(hotelId));
  hotel.value = data;
  room.value = data.rooms.find((r: any) => r.id === roomId) || data.rooms[0];

  const q = query(collection(db, 'bookings'), where('roomId', '==', roomId));
  const snap = await getDocs(q);
  bookings.value = snap.docs.map((d) => {
    const b: any = d.data();
    return { startDate: b.startDate, endDate: b.endDate };
  });

  loading.value = false;
}

onMounted(load);

const nights = computed(() => {
  if (!startDate.value || !endDate.value) return 0;
  const ms = Date.parse(endDate.value) - Date.parse(startDate.value);
  return ms > 0 ? ms / (1000 * 60 * 60 * 24) : 0;
});

const tax = computed(() =>
  Math.ceil(room.value.basePrice * nights.value * 0.05)
);
const fee = computed(() => 50);
const total = computed(
  () => room.value.basePrice * nights.value + tax.value + fee.value
);

const noOverlap = computed(() =>
  bookings.value.every(
    (b) => endDate.value <= b.startDate || startDate.value >= b.endDate
  )
);

const canBook = computed(
  () =>
    !!startDate.value &&
    !!endDate.value &&
    nights.value > 0 &&
    guests.value > 0 &&
    noOverlap.value
);

async function book() {
  if (!authStore.isLoggedIn) {
    return router.push({ name: USER_LOGIN_NAME });
  }
  const user = unref(authStore.user);
  if (!user) {
    return router.push({ name: USER_LOGIN_NAME });
  }
  if (!canBook.value) return;

  loading.value = true;
  try {
    await addDoc(collection(db, 'bookings'), {
      userId: user.uid,
      hotelId,
      roomId,
      startDate: startDate.value,
      endDate: endDate.value,
      guests: guests.value,
      nights: nights.value,
      total: total.value,
      createdAt: serverTimestamp(),
    });
    router.push({ name: USER_HOME_NAME });
  } finally {
    loading.value = false;
  }
}
</script>
