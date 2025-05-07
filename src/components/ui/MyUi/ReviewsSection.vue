<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination';
import { Flag } from 'lucide-vue-next';

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  title: string;
  text: string;
}

const allReviews: Review[] = [
  {
    id: 1,
    user: 'Omar Siphron',
    avatar: 'https://i.pravatar.cc/60?img=68',
    rating: 5,
    title: 'Amazing',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 2,
    user: 'Cristofer Ekstrom Bothman',
    avatar: 'https://i.pravatar.cc/60?img=12',
    rating: 5,
    title: 'Amazing',
    text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },

  {
    id: 2,
    user: 'Cristofer Ekstrom Bothman',
    avatar: 'https://i.pravatar.cc/60?img=12',
    rating: 5,
    title: 'Amazing',
    text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
];

const itemsPerPage = 2;

const getPageSlice = (page: number) =>
  allReviews.slice((page - 1) * itemsPerPage, page * itemsPerPage);

const averageRating = computed(() =>
  (
    allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
  ).toFixed(1)
);
</script>

<template>
  <section
    class="border-t pt-12 mt-12 max-w-screen-2xl mx-auto"
    id="hotel-reviews"
  >
    <div class="flex items-start justify-between mb-8">
      <div>
        <p class="text-5xl font-semibold leading-none">{{ averageRating }}</p>
        <p class="text-lg font-medium -mt-1">Very good</p>
        <p class="text-sm text-gray-500">
          {{ allReviews.length }} verified reviews
        </p>
      </div>

      <Button
        class="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
      >
        Give your review
      </Button>
    </div>

    <Pagination
      v-slot="{ page }"
      :items-per-page="itemsPerPage"
      :total="allReviews.length"
      :default-page="1"
      :sibling-count="1"
      show-edges
      class="space-y-8"
    >
      <ul class="space-y-8">
        <li
          v-for="review in getPageSlice(page)"
          :key="review.id"
          class="flex gap-4 border-b pb-6"
        >
          <img
            :src="review.avatar"
            alt="avatar"
            class="w-10 h-10 rounded-full object-cover mt-1"
          />
          <div class="flex-1">
            <p class="font-medium">
              <span class="text-gray-900"
                >{{ review.rating }}.0 {{ review.title }}</span
              >
              <span class="mx-1 text-gray-400">|</span>
              <span class="text-gray-600">{{ review.user }}</span>
            </p>
            <p class="text-sm text-gray-600 mt-1">{{ review.text }}</p>
          </div>
          <button class="text-gray-400 hover:text-gray-600">
            <Flag :size="18" />
          </button>
        </li>
      </ul>

      <PaginationList
        v-slot="{ items }"
        class="flex items-center gap-1 justify-center mt-6"
      >
        <PaginationFirst />
        <PaginationPrev />
        <template v-for="(item, index) in items" :key="index">
          <PaginationListItem
            v-if="item.type === 'page'"
            :value="item.value"
            as-child
          >
            <Button
              class="w-9 h-9 p-0"
              :variant="item.value === page ? 'default' : 'outline'"
            >
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :index="index" />
        </template>
        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>
  </section>
</template>
