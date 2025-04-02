<script lang="ts">
export const iframeHeight = '800px';
export const description =
  'A simple sidebar with navigation grouped by section.';
</script>
<script setup lang="ts">
import AppSidebar from '@/components/ui/AppSidebar.vue';
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
