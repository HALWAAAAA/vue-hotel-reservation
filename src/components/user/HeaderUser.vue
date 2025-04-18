<template>
  <section
    class="py-32 bg-cover bg-center relative"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div class="absolute inset-0 bg-black bg-opacity-60"></div>

    <header
      class="w-full absolute top-0 left-0 z-50 px-8 py-6 flex items-center justify-between"
    >
      <h2 class="text-white text-2xl font-semibold">
        Hotel <span class="bg-cyan-500 text-white px-2 py-1 rounded">hub</span>
      </h2>

      <nav class="flex items-center space-x-8 text-white font-medium">
        <h3 class="hover:text-cyan-300 transition cursor-pointer">About Us</h3>
        <h3 class="hover:text-cyan-300 transition cursor-pointer">
          Contact Us
        </h3>
        <h3 class="hover:text-cyan-300 transition cursor-pointer">Log In</h3>
        <Button
          class="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-md transition"
        >
          Sign Up
        </Button>
      </nav>
    </header>

    <div
      class="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4"
    >
      <h1 class="text-4xl md:text-6xl font-bold mb-8 leading-tight">
        Hotel for moments rich<br />
        in emotions
      </h1>

      <div
        class="bg-white rounded-lg shadow-lg px-6 py-6 flex flex-col gap-4 text-gray-800 w-full max-w-4xl"
      >
        <div class="flex flex-wrap md:flex-nowrap gap-4 w-full">
          <div class="flex flex-col flex-1 min-w-[200px]">
            <Label for="location" class="font-medium mb-3.5">Location</Label>
            <Input
              type="text"
              id="location"
              placeholder="Where are you going?"
              class="px-4 py-2 rounded border"
              v-model="location"
            />
          </div>
          <div class="flex flex-col flex-1 min-w-[200px]">
            <Label for="dates" class="font-medium mb-3.5">Dates</Label>
            <PickDate id="dates" />
          </div>
          <div class="flex flex-col flex-1 min-w-[200px]">
            <label class="font-medium mb-1" for="guests">Guests</label>
            <SelectPeople id="guests" />
          </div>
        </div>

        <Button
          class="bg-cyan-500 hover:bg-cyan-600 text-white w-full py-3 rounded-md transition"
          @click="handleSearch"
        >
          Search
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import bgImage from '@/assets/backMain.jpg';
import { Button } from '@/components/ui/button';
import PickDate from '../ui/MyUi/PickDate.vue';
import { Input } from '../ui/input';
import { Label } from '@/components/ui/label';
import SelectPeople from '../ui/MyUi/SelectPeople.vue';

const location = ref('');
const router = useRouter();

function handleSearch() {
  const trimmed = location.value.trim();

  if (trimmed) {
    const encodedLocation = encodeURIComponent(trimmed.toLowerCase());
    router.push(`/home/${encodedLocation}`);
  } else {
    alert('Please enter a location');
  }
}
</script>
