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
</script>

<template>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>People</SelectLabel>
        <SelectItem value="1persons"> 1 person </SelectItem>
        <SelectItem value="2persons"> 2 persons </SelectItem>
        <SelectItem value="3persons"> 3 persons </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
