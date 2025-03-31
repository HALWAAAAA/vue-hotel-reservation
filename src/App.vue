<script lang="ts">
// import { useCollection } from 'vuefire'
// import { collection } from 'firebase/firestore'
// import { db } from './components/firebase/index'

// const hotels = useCollection(collection(db, 'hotels'))

export const iframeHeight = '800px';
export const description =
  'A simple sidebar with navigation grouped by section.';
</script>
<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue';
import Toaster from '@/components/ui/toast/Toaster.vue';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import Header from './components/hotels/Header.vue';
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <Header />
      <div class="flex flex-1 flex-col gap-4 p-4">
        <Toaster />
        <router-view />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<!-- <HotelTable/> -->

<!-- <div>
    <h2>Список готелів</h2>
    <ul>
      <li v-for="hotel in hotels" :key="hotel.id">
        {{ hotel.size }}
      </li>
    </ul>
  </div> -->
