<script setup>
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Button from '../ui/button/Button.vue';
const places = [
  { name: 'Delhi', desc: 'An amazing journey', image: 'dehli.jpg' },
  { name: 'Madrid', desc: 'Palace Adventure', image: 'madrid.webp' },
  { name: 'Sydney', desc: 'Land of new adventure', image: 'sydney.jpg' },
  { name: 'Warsaw', desc: 'Amazing streets', image: 'warsaw.jpg' },
  { name: 'Berlin', desc: 'Amazing streets', image: 'berlin.jpg' },
];
</script>

<template>
  <section class="px-4 md:px-12 py-12">
    <h2 class="text-2xl font-bold mb-6">Popular Places</h2>

    <Carousel class="w-full">
      <CarouselContent>
        <CarouselItem
          v-for="(place, index) in places"
          :key="index"
          class="basis-auto md:basis-1/4"
        >
          <div class="rounded-lg overflow-hidden shadow-md relative group">
            <img
              :src="`/cards/${place.image}`"
              :alt="place.name"
              class="w-full h-72 object-cover"
            />
            <div
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4"
            >
              <h3 class="font-semibold text-lg">{{ place.name }}</h3>
              <p class="text-sm text-gray-200">{{ place.desc }}</p>
              <Button
                class="mt-3 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 text-sm rounded-md transition"
              >
                Book a Hotel
              </Button>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </section>
</template>
