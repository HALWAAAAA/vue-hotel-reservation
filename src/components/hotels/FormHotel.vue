<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/components/firebase';
import { useRouter } from 'vue-router';
import { HOME_ROUTE } from '@/routerPath';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from 'vee-validate';
import { toast } from '@/components/ui/toast';
import { h } from 'vue';
import { ToastAction } from '@/components/ui/toast';

const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2),
    type: z.string().min(2),
    description: z.string().optional(),
    email: z.string().email(),
    phone: z.string().min(6),
    address: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    lat: z.string().optional(),
    lng: z.string().optional(),
    images: z.array(z.string()).optional(),
    freeCancellationUpto24h: z.boolean().optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    numberOfReviews: z.coerce.number().min(0).optional(),
  })
);

function cleanFormValues<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as T;
}

const { handleSubmit, defineField, values, setFieldValue, resetForm } = useForm(
  {
    validationSchema: formSchema,
    initialValues: {
      images: [],
      freeCancellationUpto24h: false,
      amenities: [],
    },
  }
);

const allAmenities = [
  'Free Wi-Fi',
  'Free breakfast',
  'Free parking',
  '24hr front desk',
  'Swimming pool',
  'Air conditioning',
  'Fitness center',
  'Room service',
  'Tea/Coffee maker',
  'Restaurant',
  'Bar',
  'Spa',
  'Non-smoking rooms',
  'Pet friendly',
  'Paid breakfast',
  'Paid parking',
  'Business center',
  'Child friendly',
  'Laundry',
];

const [name] = defineField('name');
const [type] = defineField('type');
const [description] = defineField('description');
const [email] = defineField('email');
const [phone] = defineField('phone');
const [address] = defineField('address');

const [lat] = defineField('lat');
const [lng] = defineField('lng');
const [rating] = defineField('rating');
const [numberOfReviews] = defineField('numberOfReviews');
const storage = getStorage();

const onFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const file = files[0];
  const filePath = `hotel-images/${Date.now()}-${file.name}`;
  const fileRef = storageRef(storage, filePath);

  try {
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    const current = values.images || [];
    setFieldValue('images', [...current, downloadURL], true);

    toast({
      title: 'Photo is added!',
      description: 'Link is saved',
    });
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Smth went wrong with photo',
      variant: 'destructive',
    });
  }
};

const onSubmit = handleSubmit(async (formValues) => {
  try {
    const cleanedValues = cleanFormValues(formValues);
    const docRef = await addDoc(collection(db, 'hotels'), {
      ...cleanedValues,
      createdAt: new Date(),
      rooms: [],
    });
    toast({
      title: 'Good!',
      description: `Hotel saves with ID: ${docRef.id}`,
      variant: 'default',
    });
    resetForm();
    router.push(HOME_ROUTE);
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Smth went wrong. Try again',
      variant: 'destructive',
      action: h(ToastAction, { altText: 'Good' }, { default: () => 'Close' }),
    });
  }
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Hotels name</FormLabel>
        <FormControl
          ><Input placeholder="Nap. Golden Hotel" v-bind="componentField"
        /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="type">
      <FormItem>
        <FormLabel>Type</FormLabel>
        <FormControl
          ><Input placeholder="Hotel / Apartment" v-bind="componentField"
        /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl
          ><Textarea
            placeholder="Короткий опис готелю..."
            v-bind="componentField"
        /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl
          ><Input placeholder="demo@hotel.com" v-bind="componentField"
        /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="phone">
      <FormItem>
        <FormLabel>Phone number</FormLabel>
        <FormControl
          ><Input placeholder="+48 123 456 789" v-bind="componentField"
        /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="grid grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="address">
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl
            ><Input
              placeholder="Lirowa 42, Warszawa, 02-641"
              v-bind="componentField"
          /></FormControl>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="lat">
        <FormItem>
          <FormLabel>Lat</FormLabel>
          <FormControl
            ><Input placeholder="52.2297" v-bind="componentField"
          /></FormControl>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="lng">
        <FormItem>
          <FormLabel>Lng</FormLabel>
          <FormControl
            ><Input placeholder="21.0122" v-bind="componentField"
          /></FormControl>
        </FormItem>
      </FormField>
    </div>

    <Field name="freeCancellationUpto24h" type="checkbox" v-slot="{ field }">
      <FormItem>
        <FormControl>
          <div class="flex items-center gap-2">
            <Checkbox
              v-bind="field"
              :checked="field.checked"
              @update:checked="(val: boolean) => field.checked = val"
            />
            <span class="text-sm">Free Cancellation Up to 24h</span>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </Field>

    <FormField v-slot="{ componentField }" name="rating">
      <FormItem>
        <FormLabel>Rating</FormLabel>
        <FormControl
          ><Input
            type="number"
            placeholder="4.5"
            step="0.1"
            v-bind="componentField"
        /></FormControl>
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="numberOfReviews">
      <FormItem>
        <FormLabel>Reviews</FormLabel>
        <FormControl
          ><Input type="number" placeholder="0" v-bind="componentField"
        /></FormControl>
      </FormItem>
    </FormField>

    <FormField name="amenities" v-slot>
      <FormItem>
        <FormLabel>Amenities</FormLabel>
        <FormControl>
          <div class="grid grid-cols-2 gap-2">
            <label
              v-for="amenity in allAmenities"
              :key="amenity"
              class="flex items-center gap-2 text-sm"
            >
              <Field
                name="amenities"
                type="checkbox"
                :value="amenity"
                v-slot="{ field, handleChange }"
              >
                <input type="checkbox" v-bind="field" @change="handleChange" />
              </Field>
              <span>{{ amenity }}</span>
            </label>
          </div>
        </FormControl>
        <FormMessage name="amenities" />
      </FormItem>
    </FormField>

    <div>
      <label class="block text-sm font-medium mb-1">Hotels photo</label>
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

    <Button type="submit">Save a hotel</Button>
  </form>
</template>
