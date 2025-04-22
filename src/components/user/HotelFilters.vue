<template>
  <aside class="w-full md:w-64 space-y-6">
    <div>
      <p class="font-semibold mb-2">Price</p>
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>₹ {{ modelValue[0] }}</span>
        <span>₹ {{ max }}</span>
      </div>
      <!-- <Input type="range" min="500" max="20000" class="w-full" /> -->
      <Slider v-model="modelValue" :max="max" :step="100" class="w-full" />
    </div>

    <div>
      <p class="font-semibold mb-2">Rating</p>
      <div class="flex gap-2 flex-wrap">
        <Button class="border px-3 py-1 rounded">0+</Button>
        <Button class="border px-3 py-1 rounded">1+</Button>
        <Button class="border px-3 py-1 rounded">2+</Button>
        <Button class="border px-3 py-1 rounded">3+</Button>
        <Button class="border px-3 py-1 rounded">4+</Button>
      </div>
    </div>

    <div>
      <p class="font-semibold mb-2">Freebies</p>
      <div class="space-y-1 text-sm">
        <Label class="flex items-center gap-2">
          <Checkbox /> Free breakfast
        </Label>
        <Label class="flex items-center gap-2">
          <Checkbox /> Free parking
        </Label>
        <Label class="flex items-center gap-2">
          <Checkbox /> Free internet
        </Label>
        <Label class="flex items-center gap-2">
          <Checkbox /> Free cancellation
        </Label>
      </div>
    </div>

    <div>
      <p class="font-semibold mb-2">Amenities</p>
      <div class="space-y-1 text-sm">
        <Label class="flex items-center gap-2">
          <Checkbox /> 24hr front desk
        </Label>
        <Label class="flex items-center gap-2">
          <Checkbox /> Air-conditioned
        </Label>
        <Label class="flex items-center gap-2"> <Checkbox /> Fitness </Label>
        <Label class="flex items-center gap-2"> <Checkbox /> Pool </Label>
      </div>
    </div>
  </aside>
</template>

<script setup>
import Input from '../ui/input/Input.vue';
import Label from '../ui/label/Label.vue';
import Checkbox from '../ui/checkbox/Checkbox.vue';
import Button from '../ui/button/Button.vue';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { ref } from 'vue';

const modelValue = ref([5000]);
const max = 20000;
</script>
