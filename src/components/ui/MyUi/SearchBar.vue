<script setup lang="ts">
import { ref } from 'vue';
import { useHotelStore } from '@/store/hotelStore';
import { useRouter } from 'vue-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SelectPeople from '@/components/ui/MyUi/SelectPeople.vue';
import { useToast } from '@/components/ui/toast/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { h } from 'vue';
const store = useHotelStore();
const router = useRouter();
const { toast } = useToast();
const location = ref('');
const startDate = ref('');
const endDate = ref('');
const guests = ref(1);

async function doSearch() {
  const loc = location.value.trim();
  if (!loc) {
   toast({
      title: 'Нічого не введено',
      description: 'Введіть назву міста у Location',
      variant: 'destructive',
      action: h(
        ToastAction,
        { altText: 'Добре' },
        { default: () => 'Закрити' }
      ),
    });
    return;
  }

  store.setLocationSearch(loc);
  store.setDateRange(startDate.value, endDate.value);
  store.setGuestsMin(guests.value);

  await router.push(`/home/${encodeURIComponent(loc)}`);
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
      <SelectPeople v-model="guests" />
    </div>
  </div>

  <Button class="mt-4 w-full bg-cyan-500 hover:bg-cyan-600" @click="doSearch">
    Search
  </Button>
</template>
