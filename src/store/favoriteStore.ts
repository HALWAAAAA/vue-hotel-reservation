import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/components/firebase';
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useFavoriteStore = defineStore('favorites', () => {
  const favorites = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadFavorites(userId: string) {
    loading.value = true;
    error.value = null;
    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId)
      );
      const snap = await getDocs(q);
      const ids = snap.docs.map((d) => (d.data() as any).hotelId);
      favorites.value = Array.from(new Set(ids));
    } catch (e) {
      error.value = 'Failed to load favorites';
    } finally {
      loading.value = false;
    }
  }

  async function toggleFavorite(userId: string, hotelId: string) {
    if (favorites.value.includes(hotelId)) {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('hotelId', '==', hotelId)
      );
      const snap = await getDocs(q);
      await Promise.all(
        snap.docs.map((d) => deleteDoc(doc(db, 'favorites', d.id)))
      );
      favorites.value = favorites.value.filter((id) => id !== hotelId);
    } else {
      await addDoc(collection(db, 'favorites'), {
        userId,
        hotelId,
        createdAt: serverTimestamp(),
      });
      favorites.value.push(hotelId);
    }
  }

  return { favorites, loadFavorites, toggleFavorite, loading, error };
});
