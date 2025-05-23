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

defineProps<{
  modelValue: number | string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();
</script>

<template>
  <Select
    :modelValue="String(modelValue)"
    @update:modelValue="(val) => emit('update:modelValue', Number(val))"
  >
    <SelectTrigger> <SelectValue placeholder="Guests" /> </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>People</SelectLabel>
        <SelectItem value="1">1 person</SelectItem>
        <SelectItem value="2">2 persons</SelectItem>
        <SelectItem value="3">3–4 persons</SelectItem>
        <SelectItem value="5">5–6 persons</SelectItem>
        <SelectItem value="7">7+ persons</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
