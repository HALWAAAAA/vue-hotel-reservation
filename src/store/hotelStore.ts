import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/components/firebase';

interface Filters {
  priceRange: number[];
  ratingMin: number;
  startDate: string;
  endDate: string;
  amenities: string[];
  freebies: string[];
  guestsMin: number;
}

export const useHotelStore = defineStore('hotel', () => {
  const hotels = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const locationSearch = ref('');

  const filters = ref<Filters>({
    priceRange: [20000],
    ratingMin: 0,
    guestsMin: 1,
    amenities: [],
    freebies: [],
    startDate: '',
    endDate: '',
  });

  function setGuestsMin(v: number) {
    filters.value.guestsMin = v;
  }
  function setDateRange(start: string, end: string) {
    filters.value.startDate = start;
    filters.value.endDate = end;
  }
  async function loadHotels() {
    loading.value = true;
    error.value = null;

    try {
      const snap = await getDocs(collection(db, 'hotels'));
      console.log('Firebase snapshot length:', snap.docs.length);

      hotels.value = snap.docs.map((d) => {
        const data: any = d.data();

        const avail = data.rooms ?? [];

        data.fromPrice = avail.length
          ? Math.min(...avail.map((r: any) => Number(r.basePrice)))
          : Infinity;

        const hotel = { id: d.id, ...data };
        console.log(
          'Hotel loaded:',
          hotel.name,
          '| fromPrice:',
          hotel.fromPrice
        );
        return hotel;
      });

      const maxPrice = Math.max(
        ...hotels.value.map((h) => (h.fromPrice === Infinity ? 0 : h.fromPrice))
      );
      filters.value.priceRange = [maxPrice];
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
    const docRef = doc(db, 'hotels', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Hotel not found');

    const data: any = docSnap.data();
    const avail = data.rooms ?? [];
    data.fromPrice = avail.length
      ? Math.min(...avail.map((r: any) => Number(r.basePrice)))
      : Infinity;

    const hotel = { id: docSnap.id, ...data };

    if (!hotels.value.find((h) => h.id === id)) hotels.value.push(hotel);

    return hotel;
  }

  function setRatingMin(v: number) {
    filters.value.ratingMin = v;
  }

  function toggleAmenity(a: string) {
    const arr = filters.value.amenities;
    const i = arr.indexOf(a);
    i === -1 ? arr.push(a) : arr.splice(i, 1);
  }

  const normalize = (text: string | undefined | null = '') =>
    (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const filteredHotels = computed(() =>
    hotels.value.filter(
      (h) =>
        h.fromPrice !== Infinity &&
        h.fromPrice <= filters.value.priceRange[0] &&
        h.rating >= filters.value.ratingMin &&
        h.rooms?.some(roomFitsFilters) &&
        filters.value.amenities.every((a) => h.amenities?.includes(a)) &&
        filters.value.freebies.every((f) => h.amenities?.includes(f)) &&
        (locationSearch.value === '' ||
          normalize(h.address).includes(normalize(locationSearch.value)))
    )
  );

  function roomFitsFilters(room: any) {
    if (room.maxGuests < filters.value.guestsMin) return false;

    const { startDate, endDate } = filters.value;
    if (!startDate || !endDate) return true;

    if (!room.startDate || !room.endDate) return false;

    const wantStart = new Date(startDate);
    const wantEnd = new Date(endDate);
    const availStart = new Date(room.startDate);
    const availEnd = new Date(room.endDate);

    return wantStart >= availStart && wantEnd <= availEnd;
  }

  const allAmenities = computed(() => {
    const set = new Set<string>();
    hotels.value.forEach((h) =>
      h.amenities?.forEach((a: string) => set.add(a))
    );
    return [...set].sort();
  });

  function updateHotelImages(id: string, newImages: string[]) {
    const hotel = getHotelById(id);
    if (hotel) {
      hotel.images = newImages;
    }
  }

  function setLocationSearch(val: string) {
    locationSearch.value = val.toLowerCase().trim();
  }

  return {
    hotels,
    loading,
    error,
    loadHotels,
    getHotelById,
    fetchHotelById,
    filters,
    setRatingMin,
    toggleAmenity,
    filteredHotels,
    allAmenities,
    updateHotelImages,
    locationSearch,
    setLocationSearch,
    setGuestsMin,
    setDateRange,
    roomFitsFilters,
  };
});
