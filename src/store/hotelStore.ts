// stores/hotelStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/components/firebase';

export const useHotelStore = defineStore('hotel', () => {
  const hotels = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadHotels() {
    loading.value = true;
    error.value = null;
    try {
      const snapshot = await getDocs(collection(db, 'hotels'));
      hotels.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error(err);
      error.value = 'Failed to load hotels';
    } finally {
      loading.value = false;
    }
  }

  function getHotelById(id: string) {
    return hotels.value.find((h) => h.id === id);
  }

  async function fetchHotelById(id: string) {
    try {
      const docRef = doc(db, 'hotels', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Hotel not found');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return {
    hotels,
    loading,
    error,
    loadHotels,
    getHotelById,
    fetchHotelById,
  };
});
