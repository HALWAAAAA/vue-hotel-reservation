<template>
  <div class="max-w-3xl mx-auto py-8">
    <h1 class="text-3xl font-extrabold mb-8 text-gray-800">
      My Booking Requests
    </h1>
    <ul v-if="requests.length" class="grid gap-6">
      <li
        v-for="r in requests"
        :key="r.id"
        class="bg-white rounded-2xl p-6 flex justify-between items-center shadow-lg hover:shadow-xl transition-shadow"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ r.hotelName || '—' }}
          </h2>
          <p class="mt-1 text-gray-600">
            Room <span class="font-medium">{{ r.roomId }}</span>
          </p>
          <p class="mt-2 text-sm text-gray-500">
            {{ r.startDate }} &mdash; {{ r.endDate }}
          </p>
        </div>
        <Button
          @click="deleteRequest(r.id)"
          class="ml-6 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete
        </Button>
      </li>
    </ul>
    <p v-else class="mt-12 text-center text-gray-400 italic">
      No booking requests found.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, unref, watch } from 'vue';
import { useAuthStore } from '@/store/authStore';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/components/firebase';
import Button from '@/components/ui/button/Button.vue';
interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  hotelName?: string;
}

const authStore = useAuthStore();
const requests = ref<Booking[]>([]);

async function fetchRequests() {
  const user = unref(authStore.user);
  const uid = user?.uid;

  let snap;
  if (authStore.isAdmin) {
    snap = await getDocs(collection(db, 'bookings'));
  } else {
    if (!uid) {
      requests.value = [];
      return;
    }
    snap = await getDocs(
      query(collection(db, 'bookings'), where('userId', '==', uid))
    );
  }

  const list: Booking[] = [];
  for (const d of snap.docs) {
    const data = d.data() as Omit<Booking, 'id' | 'hotelName'>;
    const rec: Booking = { id: d.id, ...data };

    const hotelDoc = await getDoc(doc(db, 'hotels', rec.hotelId));
    if (hotelDoc.exists()) {
      rec.hotelName = (hotelDoc.data() as any).name;
    }

    list.push(rec);
  }

  requests.value = list;
}

async function deleteRequest(id: string) {
  await deleteDoc(doc(db, 'bookings', id));
  requests.value = requests.value.filter((r) => r.id !== id);
}

onMounted(() => {
  const u = unref(authStore.user);
  if (u) {
    fetchRequests();
  }
});

watch(
  () => unref(authStore.user),
  (u) => {
    if (u) fetchRequests();
  }
);
</script>
