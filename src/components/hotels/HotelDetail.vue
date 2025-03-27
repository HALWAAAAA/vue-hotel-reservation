<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Hotel Details</h1>

    <div v-if="hotel">
      <div class="space-y-1">
        <p><strong>Name:</strong> {{ hotel.name }}</p>
        <p><strong>Type:</strong> {{ hotel.type }}</p>
        <p><strong>Email:</strong> {{ hotel.email }}</p>
        <p><strong>Phone:</strong> {{ hotel.phone }}</p>
        <p><strong>Area:</strong> {{ hotel.area }}</p>
        <p><strong>State:</strong> {{ hotel.state }}</p>
        <p><strong>Pincode:</strong> {{ hotel.pincode }}</p>
        <p><strong>Description:</strong> {{ hotel.description }}</p>
        <p><strong>Rating:</strong> {{ hotel.rating }}</p>
        <p><strong>Number of Reviews:</strong> {{ hotel.numberOfReviews }}</p>
        <p>
          <strong>Free Cancellation (24h):</strong>
          {{ hotel.freeCancellationUpto24h ? 'Так' : 'Ні' }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <img
          v-for="(img, i) in hotel.images"
          :key="i"
          :src="img"
          class="w-full h-40 object-cover rounded"
        />
      </div>

      <RouterLink :to="`/hotels/${hotelId}/add-room`">
        <Button class="mt-4">Додати кімнату</Button>
      </RouterLink>

      <!-- Редагування -->
      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button class="mt-2 ml-10" variant="outline">Редагувати</Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Редагувати готель</DialogTitle>
            <DialogDescription>Онови дані про готель нижче</DialogDescription>
          </DialogHeader>

          <ScrollArea class="max-h-[65vh] pr-4">
            <form @submit.prevent="updateHotel" class="space-y-3 pb-6">
              <div v-for="(field, key) in editableFields" :key="key">
                <Label :for="key">{{ field.label }}</Label>
                <template v-if="key === 'freeCancellationUpto24h'">
                  <div class="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      :id="key"
                      v-model="editableFields[key].value"
                    />
                    <span class="text-sm"
                      >Безкоштовне скасування до 24 год</span
                    >
                  </div>
                </template>
                <template v-else>
                  <Input
                    :id="key"
                    v-model="editableFields[key].value"
                    :type="
                      ['rating', 'numberOfReviews'].includes(key)
                        ? 'number'
                        : 'text'
                    "
                    :placeholder="field.placeholder"
                  />
                </template>
              </div>

              <DialogFooter class="pt-4">
                <Button type="submit">Зберегти</Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>

    <div v-else>
      <p>Loading hotel details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/components/firebase';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const route = useRoute();
const hotelId = route.params.id as string;
const hotel = ref<any | null>(null);
const dialogOpen = ref(false);

const editableFields = ref<
  Record<string, { label: string; value: any; placeholder?: string }>
>({});

onMounted(async () => {
  const docRef = doc(db, 'hotels', hotelId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    hotel.value = docSnap.data();

    editableFields.value = {
      name: { label: 'Назва', value: hotel.value.name || '' },
      type: { label: 'Тип', value: hotel.value.type || '' },
      email: { label: 'Email', value: hotel.value.email || '' },
      phone: { label: 'Телефон', value: hotel.value.phone || '' },
      area: { label: 'Район', value: hotel.value.area || '' },
      state: { label: 'Воєводство', value: hotel.value.state || '' },
      pincode: { label: 'Поштовий індекс', value: hotel.value.pincode || '' },
      description: { label: 'Опис', value: hotel.value.description || '' },
      rating: { label: 'Рейтинг', value: hotel.value.rating || 0 },
      numberOfReviews: {
        label: 'Кількість відгуків',
        value: hotel.value.numberOfReviews || 0,
      },
      freeCancellationUpto24h: {
        label: 'Скасування до 24 год',
        value: hotel.value.freeCancellationUpto24h ?? false,
      },
    };
  }
});

const updateHotel = async () => {
  const updatedData: Record<string, any> = {};

  for (const [key, field] of Object.entries(editableFields.value)) {
    if (['rating', 'numberOfReviews'].includes(key)) {
      updatedData[key] = Number(field.value);
    } else {
      updatedData[key] = field.value;
    }
  }

  try {
    await updateDoc(doc(db, 'hotels', hotelId), updatedData);
    toast({ title: 'Успіх', description: 'Готель оновлено' });
    hotel.value = { ...hotel.value, ...updatedData };
    dialogOpen.value = false;
  } catch (err) {
    toast({ title: 'Помилка', description: 'Не вдалося оновити готель' });
  }
};
</script>
