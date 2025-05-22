<template>
  <div class="max-w-3xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">My Profile</h1>
    <p class="mb-4">Hello, {{ userEmail }}</p>

    <h2 class="text-xl font-semibold mb-4">My Bookings</h2>
    <ul v-if="bookings.length" class="space-y-4">
      <li
        v-for="b in bookings"
        :key="b.id"
        class="flex justify-between items-center border rounded-lg p-4 shadow"
      >
        <div>
          <p>
            <span class="font-semibold">{{ b.hotelName || '—' }}</span>
            — room {{ b.roomId }}
          </p>
          <p class="text-sm text-gray-600">
            {{ b.startDate }} → {{ b.endDate }}
          </p>
        </div>
        <Button
          @click="cancel(b.id)"
          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Cancel
        </Button>
      </li>
    </ul>
    <p v-else class="text-center text-gray-500">You have no bookings.</p>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, unref, computed } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '@/components/firebase'
import Button from '@/components/ui/button/Button.vue'

interface Booking {
  id: string
  userId: string
  hotelId: string
  roomId: string
  startDate: string
  endDate: string
  hotelName?: string
}

const authStore = useAuthStore()
const router = useRouter()

const bookings = ref<Booking[]>([])
const userEmail = computed(() => authStore.user?.email || '')

async function fetchMyBookings() {
  const uid = unref(authStore.user)?.uid
  if (!uid) return
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', uid)
  )
  const snap = await getDocs(q)
  const list: Booking[] = []
  for (const d of snap.docs) {
    const data = d.data() as Omit<Booking, 'id' | 'hotelName'>
    const rec: Booking = { id: d.id, ...data }
    const hotelDoc = await getDoc(doc(db, 'hotels', rec.hotelId))
    if (hotelDoc.exists())
      rec.hotelName = (hotelDoc.data() as any).name
    list.push(rec)
  }
  bookings.value = list
}

async function cancel(id: string) {
  await deleteDoc(doc(db, 'bookings', id))
  bookings.value = bookings.value.filter(b => b.id !== id)
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push({ name: 'Login' })
  } else {
    fetchMyBookings()
  }
})
</script>
