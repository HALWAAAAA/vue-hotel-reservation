<script setup>
const getImage = (file: string) => `${import.meta.env.BASE_URL}${file}`;

const testimonials = [
  {
    name: 'Janet House',
    image: getImage('woman.jpg'),
    text: '“We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.”',
  },
  {
    name: 'James Scott',
    image: getImage('man.jpg'),
    text: '“We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.”',
  },
  {
    name: 'James Scott',
    image: getImage('man.jpg'),
    text: '“We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.”',
  },
  {
    name: 'James Scott',
    image: getImage('man.jpg'),
    text: '“We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.”',
  },
];
</script>

<template>
  <section class="py-20 px-6 md:px-12 bg-white text-center">
    <p class="text-cyan-500 uppercase font-semibold text-sm tracking-wide mb-3">
      Testimonials
    </p>
    <h2 class="text-4xl md:text-5xl font-bold mb-16">
      Don’t just take our words
    </h2>

    <div
      class="flex flex-col md:flex-row justify-center items-start gap-12 w-full mx-auto"
    >
      <div
        v-for="(item, index) in testimonials"
        :key="index"
        class="flex flex-col items-center text-center md:text-left max-w-sm"
      >
        <img
          :src="item.image"
          :alt="item.name"
          class="w-36 h-36 object-cover rounded-xl shadow-lg mb-6"
        />
        <div class="flex items-center gap-1 text-cyan-500 mb-4 text-lg">
          <span v-for="i in 5" :key="i">★</span>
        </div>
        <p class="text-gray-700 text-lg leading-relaxed mb-4">
          {{ item.text }}
        </p>
        <p class="font-semibold text-black text-base">{{ item.name }}</p>
      </div>
    </div>
  </section>
</template>
