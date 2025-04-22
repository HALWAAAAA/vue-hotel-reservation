<script lang="ts">
export const iframeHeight = '800px';
export const description =
  'A simple sidebar with navigation grouped by section.';
</script>
<script lang="ts" setup>
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import Header from '@/components/hotels/Header.vue';
import AppSidebar from '@/components/ui/AppSidebar.vue';
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <Header />
      <div class="flex flex-col p-4 gap-4">
        <router-view />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
