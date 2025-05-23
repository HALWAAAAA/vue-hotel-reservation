<script setup lang="ts">
import { useHotelStore } from '@/store/hotelStore';
import { useRouter } from 'vue-router';
import { useRouteQuery } from '@vueuse/router';
import { syncRef } from '@vueuse/core';
import { computed } from 'vue';
import type { Ref } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SelectPeople from '@/components/ui/MyUi/SelectPeople.vue';
import { useToast } from '@/components/ui/toast/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { h } from 'vue';
import { USER_SEARCH_ROUTE } from '@/routerPath';
const store = useHotelStore();
const router = useRouter();
const { toast } = useToast();

const location: Ref<string> = useRouteQuery('location', '');
const startDate: Ref<string> = useRouteQuery('startDate', '');
const endDate: Ref<string> = useRouteQuery('endDate', '');
const guestsFromQuery: Ref<number> = useRouteQuery('guests', '1', {
  transform: (val: string | null | undefined): number => {
    const num = Number(val);
    return isNaN(num) || num < 1 ? 1 : num;
  },
});

const guestsInStore = computed({
  get: () => store.filters.guestsMin,
  set: (val) => store.setGuestsMin(val),
});

syncRef(guestsFromQuery, guestsInStore);

async function doSearch() {
  const currentLocFromQuery = String(location.value || '');
  const trimmedLoc = currentLocFromQuery.trim();
  if (!trimmedLoc) {
    toast({
      title: 'Nothing to search',
      description: 'Write a city',
      variant: 'destructive',
      action: h(ToastAction, { altText: 'Good' }, { default: () => 'Close' }),
    });
    return;
  }

  if (location.value !== trimmedLoc) {
    location.value = trimmedLoc;
  }

  store.setLocationSearch(trimmedLoc);
  store.setDateRange(startDate.value, endDate.value);

  await router.push({
    path: USER_SEARCH_ROUTE,
    query: {
      location: location.value,
      startDate: startDate.value || undefined,
      endDate: endDate.value || undefined,
      guests: guestsFromQuery.value,
    },
  });
}
</script>

<template>
  <div class="flex flex-wrap md:flex-nowrap gap-4 w-full">
    <div class="flex flex-col flex-1 min-w-[200px]">
      <label class="font-medium mb-1" for="loc">Location</label>
      <Input id="loc" v-model="location" placeholder="Where are you going?" />
    </div>

    <div class="flex flex-col flex-1 min-w-[200px]">
      <label class="font-medium mb-1">Dates</label>
      <div class="flex gap-2">
        <Input type="date" v-model="startDate" class="flex-1" />
        <Input type="date" v-model="endDate" class="flex-1" />
      </div>
    </div>

    <div class="flex flex-col flex-1 min-w-[200px]">
      <label class="font-medium mb-1">Guests</label>
      <SelectPeople v-model="guestsFromQuery" />
    </div>
  </div>

  <Button class="mt-4 w-full bg-cyan-500 hover:bg-cyan-600" @click="doSearch">
    Search
  </Button>
</template>
