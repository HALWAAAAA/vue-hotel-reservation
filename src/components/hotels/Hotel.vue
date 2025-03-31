<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/components/firebase';

import { columns } from './columns';
import DataTable from '../hotels/data-table.vue';
import type { Hotel } from './hotel';

const hotels = ref<Hotel[]>([]);
const handleDeleted = (ids: string[]) => {
  hotels.value = hotels.value.filter((h) => !ids.includes(h.id));
};
onMounted(async () => {
  const snapshot = await getDocs(collection(db, 'hotels'));
  hotels.value = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '—',
      area: data.area || '—',
      email: data.email || '—',
      rooms: Array.isArray(data.rooms) ? data.rooms.length : 0,
    } satisfies Hotel;
  });
});
</script>

<template>
  <DataTable :columns="columns" :data="hotels" @deleted="handleDeleted" />
</template>
