<template>
  <section
    id="hotel-reviews"
    class="border-t pt-12 mt-12 max-w-screen-2xl mx-auto px-4"
  >
    <div class="flex items-start justify-between mb-8">
      <div>
        <p class="text-5xl font-semibold leading-none">
          {{ averageRating.toFixed(1) }}
        </p>
        <p class="text-lg font-medium -mt-1">
          {{ ratingLabel }}
        </p>
        <p class="text-sm text-gray-500">
          {{ reviews.length }} verified review<span v-if="reviews.length !== 1">s</span>
        </p>
      </div>
      <RouterLink
        :to="{ name: USER_REVIEW_NAME, params: { hotelId: hotelId } }"
        class="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
      >
        Give your review
      </RouterLink>
    </div>

    <div v-if="loading" class="text-center py-20">
      Loading reviews…
    </div>

    <Pagination
      v-else
      v-slot="{ page }"
      :items-per-page="itemsPerPage"
      :total="reviews.length"
      :default-page="1"
      :sibling-count="1"
      show-edges
      class="space-y-8"
    >
      <ul class="space-y-8">
        <li
          v-for="r in pagedReviews(page)"
          :key="r.id"
          class="flex flex-col gap-2 border-b pb-6"
        >
          <p class="text-gray-800">{{ r.text }}</p>
          <p class="text-xs text-gray-500">
            by {{ r.userId }} · {{ formatDate(r.createdAt) }}
          </p>
        </li>
      </ul>

      <PaginationList
        v-slot="{ items }"
        class="flex items-center gap-1 justify-center mt-6"
      >
        <PaginationFirst />
        <PaginationPrev />
        <template v-for="(item, idx) in items" :key="idx">
          <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
            <Button
              class="w-9 h-9 p-0"
              :variant="item.value === page ? 'default' : 'outline'"
            >
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :index="idx" />
        </template>
        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { USER_REVIEW_NAME } from '@/routerPath'
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/components/firebase'

interface ReviewDoc {
  id: string
  userId: string
  text: string
  createdAt: Timestamp
}

const route = useRoute()
const hotelId = computed(() => route.params.id as string)

const reviews = ref<ReviewDoc[]>([])
const loading = ref(true)

async function loadReviews(id: string) {
  loading.value = true
  const q = query(collection(db, 'reviews'), where('hotelId', '==', id))
  const snap = await getDocs(q)
  reviews.value = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
  loading.value = false
}

onMounted(() => {
  if (hotelId.value) loadReviews(hotelId.value)
})

watch(hotelId, id => {
  if (id) loadReviews(id)
})

const itemsPerPage = 5

function pagedReviews(page: number) {
  const start = (page - 1) * itemsPerPage
  return reviews.value.slice(start, start + itemsPerPage)
}

const averageRating = computed<number>(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, r) => acc + ((r as any).rating || 0), 0)
  return sum / reviews.value.length
})

const ratingLabel = computed<string>(() => {
  const avg = averageRating.value
  if (avg >= 4) return 'Very good'
  if (avg >= 3) return 'Good'
  return 'Review'
})

function formatDate(ts: Timestamp) {
  return ts.toDate().toLocaleDateString()
}
</script>
