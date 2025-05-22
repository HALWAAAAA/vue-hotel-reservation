<template>
  <div
    v-if="auth.loading"
    class="fixed inset-0 flex items-center justify-center bg-white z-50"
  >
    <Spinner class="h-12 w-12" />
  </div>
  <section v-else
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
       
      <nav  class="flex items-center space-x-8 text-white font-medium">
        <template v-if="!auth.isLoggedIn">
          <RouterLink
            :to="{ name: USER_LOGIN_NAME }"
            class="hover:text-cyan-300 transition cursor-pointer"
          >
            Log In
          </RouterLink>
          <RouterLink
            :to="{ name: USER_REGISTER_NAME }"
            class="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-md transition"
          >
            Sign Up
          </RouterLink>
        </template>

        <template v-else>
          <RouterLink
            :to="{ name: USER_PROFILE_NAME }"
            class="hover:text-cyan-300 transition cursor-pointer"
          >
            Profile
          </RouterLink>

          <RouterLink
            :to="{ name: USER_FOLLOWED_NAME }"
            class="hover:text-cyan-300 transition cursor-pointer"
          >
            Followed
          </RouterLink>

          <Button
            @click="auth.logout"
            class="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-md transition"
          >
            Sign Out
          </Button>
        </template>
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
        <SearchBar />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import bgImage from '@/assets/backMain.jpg';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Label } from '@/components/ui/label';
import SelectPeople from '../ui/MyUi/SelectPeople.vue';
import SearchBar from '../ui/MyUi/SearchBar.vue';
import { useHotelStore } from '@/store/hotelStore';
import { useToast } from '@/components/ui/toast/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { h } from 'vue';
import { useAuthStore } from '@/store/authStore';
import {
  USER_LOGIN_NAME,
  USER_REGISTER_NAME,
  USER_SEARCH_NAME,
  USER_PROFILE_NAME,
  USER_FOLLOWED_NAME,
} from '@/routerPath';

const store = useHotelStore();
const router = useRouter();
const location = ref('');
const startDate = ref('');
const endDate = ref('');
const { toast } = useToast();
const auth = useAuthStore();

watch([startDate, endDate], ([s, e]) => store.setDateRange(s, e));

function handleSearch() {
  const trimmed = location.value.trim();
  if (trimmed) {
    store.setLocationSearch(trimmed);
    router.push({
      name: USER_SEARCH_NAME,
      params: { location: trimmed },
    });
  } else {
    toast({
      title: 'Нічого не вибрано',
      description: 'Вибери готелі для видалення',
      variant: 'destructive',
      action: h(
        ToastAction,
        { altText: 'Добре' },
        { default: () => 'Закрити' }
      ),
    });
  }
}
</script>
