<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { storeToRefs } from 'pinia';
import { useHotelStore } from '@/store/hotelStore';
const store = useHotelStore();
const { filters } = storeToRefs(store);
</script>

<template>
  <Select
    :modelValue="String(filters.guestsMin)"
    @update:modelValue="(val) => store.setGuestsMin(Number(val))"
  >
    <SelectTrigger> <SelectValue placeholder="Guests" /> </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>People</SelectLabel>
        <SelectItem value="1">1 person</SelectItem>
        <SelectItem value="2">2 persons</SelectItem>
        <SelectItem value="3">3 – 4 persons</SelectItem>
        <SelectItem value="5">5 – 6 persons</SelectItem>
        <SelectItem value="7">7+ persons</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
