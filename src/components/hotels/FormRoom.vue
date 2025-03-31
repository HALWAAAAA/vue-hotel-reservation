<script setup lang="ts">
import { useForm, useField, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/components/firebase';
import { toast } from '@/components/ui/toast';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const roomSchema = toTypedSchema(
  z.object({
    roomArea: z.string().min(1),
    propertySize: z.coerce.number().min(1),
    accommodationType: z.string().min(1),
    basePrice: z.coerce.number().min(1),
    available: z.boolean().optional(),
    images: z.array(z.string()).optional(),
  })
);

const route = useRoute();
const router = useRouter();
const hotelId = route.params.id as string;

const { handleSubmit, defineField, values, setFieldValue, resetForm } = useForm(
  {
    validationSchema: roomSchema,
    initialValues: {
      available: false,
      images: [],
    },
  }
);

const [roomArea] = defineField('roomArea');
const [propertySize] = defineField('propertySize');
const [accommodationType] = defineField('accommodationType');
const [basePrice] = defineField('basePrice');

const { value: available } = useField<boolean>('available');

const onFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const file = files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const url = reader.result as string;
    const current = values.images || [];
    setFieldValue('images', [...current, url]);
    toast({
      title: 'Фото додано (тимчасово)',
      description: 'Зображення лише для превʼю',
    });
  };
  reader.readAsDataURL(file);
};

const onSubmit = handleSubmit(async (formValues) => {
  try {
    const hotelRef = doc(db, 'hotels', hotelId);
    await updateDoc(hotelRef, {
      rooms: arrayUnion(formValues),
    });
    toast({
      title: 'Успіх',
      description: 'Кімната додана',
    });
    resetForm();
    router.push(`/hotels/${hotelId}`);
  } catch (err) {
    toast({ title: 'Помилка', description: 'Не вдалося зберегти' });
    console.error(err);
  }
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6 p-4">
    <FormField v-slot="{ componentField }" name="roomArea">
      <FormItem>
        <FormLabel>Площа кімнати</FormLabel>
        <FormControl
          ><Input placeholder="32" v-bind="componentField"
        /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="propertySize">
      <FormItem>
        <FormLabel>Загальна площа</FormLabel>
        <FormControl
          ><Input placeholder="100" v-bind="componentField"
        /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="accommodationType">
      <FormItem>
        <FormLabel>Тип розміщення</FormLabel>
        <FormControl
          ><Input placeholder="Single / Deluxe" v-bind="componentField"
        /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="basePrice">
      <FormItem>
        <FormLabel>Ціна за ніч</FormLabel>
        <FormControl
          ><Input type="number" placeholder="300" v-bind="componentField"
        /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Field name="available" type="checkbox" v-slot="{ field }">
      <FormItem>
        <FormControl>
          <div class="flex items-center gap-2">
            <Checkbox
              v-bind="field"
              :checked="field.checked"
              @update:checked="(val: boolean) => field.checked = val"
            />
            <span class="text-sm">Кімната доступна</span>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </Field>

    <div>
      <label class="block text-sm font-medium mb-1">Фото кімнати</label>
      <input type="file" accept="image/*" @change="onFileChange" />
      <div class="grid grid-cols-2 gap-4 mt-2">
        <img
          v-for="(url, i) in values.images"
          :key="i"
          :src="url"
          class="w-full h-32 object-cover rounded-md border"
        />
      </div>
    </div>

    <Button type="submit">Додати кімнату</Button>
  </form>
</template>
