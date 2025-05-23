<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/components/firebase';
import { toast } from '@/components/ui/toast';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HOTEL_DETAILS_NAME } from '@/routerPath';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const roomSchema = toTypedSchema(
  z.object({
    accommodationType: z.string().min(1),
    basePrice: z.coerce.number().min(1),
    maxGuests: z.coerce.number().min(1),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    images: z.array(z.string()).optional(),
  })
);

const route = useRoute();
const router = useRouter();
const hotelId = route.params.id as string;
const hotel = ref<any>(null);

onMounted(async () => {
  const hotelRef = doc(db, 'hotels', hotelId);
  const hotelSnap = await getDoc(hotelRef);
  if (hotelSnap.exists()) {
    hotel.value = hotelSnap.data();
  }
});

const { handleSubmit, defineField, values, setFieldValue, resetForm } = useForm(
  {
    validationSchema: roomSchema,
    initialValues: {
      maxGuests: 1,
      startDate: '',
      endDate: '',
      images: [],
    },
  }
);

const [accommodationType] = defineField('accommodationType');
const [basePrice] = defineField('basePrice');
const [maxGuests] = defineField('maxGuests');
const storage = getStorage();
const [startDate] = defineField('startDate');
const [endDate] = defineField('endDate');
const [images] = defineField('images');

const onFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  let currentIndex = 0;
  if (hotel.value?.rooms) {
    currentIndex = hotel.value.rooms.length;
  }

  const file = files[0];
  const filePath = `hotels/${hotelId}/rooms/${currentIndex}/${Date.now()}-${
    file.name
  }`;
  const fileRef = storageRef(storage, filePath);

  try {
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    const current = values.images || [];
    setFieldValue('images', [...current, downloadURL]);
    toast({
      title: 'Photo is added!',
      description: 'Link is saved to form',
    });
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Photo is not downloaded',
      variant: 'destructive',
    });
  }
};

const onSubmit = handleSubmit(async (v) => {
  if (!v.startDate || !v.endDate) {
    toast({
      title: 'Error',
      description: 'Choose a date',
      variant: 'destructive',
    });
    return;
  }

  const room = {
    accommodationType: v.accommodationType,
    basePrice: v.basePrice,
    maxGuests: v.maxGuests,
    startDate: v.startDate,
    endDate: v.endDate,
    images: v.images,
  };

  try {
    await updateDoc(doc(db, 'hotels', hotelId), { rooms: arrayUnion(room) });
    toast({ title: 'success', description: 'Room is added' });
    resetForm();
    router.push({ name: HOTEL_DETAILS_NAME, params: { id: hotelId } });
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Data is not saved',
      variant: 'destructive',
    });
  }
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6 p-4">
    <FormField v-slot="{ componentField }" name="accommodationType">
      <FormItem>
        <FormLabel>Type accomodation</FormLabel>
        <FormControl>
          <Input placeholder="Single / Deluxe" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="basePrice">
      <FormItem>
        <FormLabel>Price per night</FormLabel>
        <FormControl>
          <Input type="number" placeholder="300" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="maxGuests">
      <FormItem>
        <FormLabel>Max guests</FormLabel>
        <FormControl>
          <Input type="number" placeholder="2" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="startDate">
      <FormItem>
        <FormLabel>From</FormLabel>
        <FormControl>
          <Input type="date" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="endDate">
      <FormItem>
        <FormLabel>To</FormLabel>
        <FormControl>
          <Input type="date" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div>
      <label class="block text-sm font-medium mb-1">Photo of room</label>
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

    <Button type="submit">Add a room</Button>
  </form>
</template>
