<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="h-32 bg-gradient-to-r from-purple-700 to-indigo-600"></div>

      <form @submit.prevent="onRegister" class="px-8 py-10">
        <h2 class="text-2xl font-semibold text-center mb-6">Register</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Password</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {{ loading ? 'Реєстрація…' : 'Зареєструватися' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '@/components/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { USER_HOME_NAME } from '@/routerPath';
import { useToast } from '@/components/ui/toast/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { h } from 'vue';
const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();
const { toast } = useToast();

async function onRegister() {
  loading.value = true;
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = cred.user;

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      isAdmin: false,
      createdAt: serverTimestamp(),
    });

    router.push({ name: USER_HOME_NAME });
  } catch (e: any) {
    toast({
      title: 'Error',
      description: 'This user already exists.',
      variant: 'destructive',
      action: h(
        ToastAction,
        { altText: 'Good' },
        { default: () => 'Close' }
      ),
    });
  } finally {
    loading.value = false;
  }
}
</script>
