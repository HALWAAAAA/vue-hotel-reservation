<script setup lang="ts">
import { HOME_ROUTE, USER_TERMS_ROUTE } from '@/routerPath';
</script>

<template>
  <footer class="bg-gray-50 text-gray-700 py-16 px-6 md:px-12">
    <div class="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <h3 class="text-lg font-semibold mb-2">About</h3>
        <p class="font-semibold">Rareblocks</p>
        <p class="text-sm mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dictum
          aliquet accumsan porta lectus ridiculus in mattis. Netus sodales in
          volutpat ullamcorper amet adipiscing fermentum.
        </p>
        <div class="flex gap-4 mt-5 text-xl">
          <a href="#" class="hover:text-cyan-500"
            ><i class="fab fa-twitter"></i
          ></a>
          <a href="#" class="hover:text-cyan-500"
            ><i class="fab fa-facebook"></i
          ></a>
          <a href="#" class="hover:text-cyan-500"
            ><i class="fab fa-instagram"></i
          ></a>
          <a href="#" class="hover:text-cyan-500"
            ><i class="fab fa-github"></i
          ></a>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-3">Company</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="#" class="hover:text-cyan-500">About</a></li>
          <li><a href="#" class="hover:text-cyan-500">Features</a></li>
          <li><a href="#" class="hover:text-cyan-500">Works</a></li>
          <li><a href="#" class="hover:text-cyan-500">Career</a></li>
        </ul>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-3">Help</h3>
        <ul class="space-y-2 text-sm">
          <li>
            <a :href="USER_TERMS_ROUTE" class="hover:text-cyan-500"
              >Customer Support</a
            >
          </li>
          <li><a href="#" class="hover:text-cyan-500">Delivery Details</a></li>
          <li>
            <a :href="USER_TERMS_ROUTE" class="hover:text-cyan-500"
              >Terms & Conditions</a
            >
          </li>
          <li>
            <a :href="USER_TERMS_ROUTE" class="hover:text-cyan-500"
              >Privacy Policy</a
            >
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-3">Resources</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="#" class="hover:text-cyan-500">Free eBooks</a></li>
          <li>
            <a href="#" class="hover:text-cyan-500">Development Tutorial</a>
          </li>
          <li><a href="#" class="hover:text-cyan-500">How to – Blog</a></li>
          <li><a href="#" class="hover:text-cyan-500">Youtube Playlist</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>
