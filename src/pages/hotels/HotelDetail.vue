<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Hotel Details</h1>

    <div v-if="hotel">
      <div class="space-y-1">
        <p><strong>Name:</strong> {{ hotel.name }}</p>
        <p><strong>Type:</strong> {{ hotel.type }}</p>
        <p><strong>Email:</strong> {{ hotel.email }}</p>
        <p><strong>Phone:</strong> {{ hotel.phone }}</p>
        <p><strong>Address:</strong> {{ hotel.address }}</p>
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

      <RouterLink :to="{ name: FORM_ROOM_NAME, params: { id: hotelId } }">
        <Button class="mt-4">Add room</Button>
      </RouterLink>

      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button class="mt-2 ml-10" variant="outline">Change data</Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Change hotel</DialogTitle>
            <DialogDescription>Update hotel's data</DialogDescription>
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
                    <span class="text-sm">Free Cancellation before 24h</span>
                  </div> </template
                ><template v-else-if="key === AMENITIES_KEY">
                  <div class="grid grid-cols-2 gap-2 mt-1">
                    <label
                      v-for="amenity in allAmenities"
                      :key="amenity"
                      class="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        :value="amenity"
                        v-model="editableFields[key].value"
                      />
                      <span>{{ amenity }}</span>
                    </label>
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
                    :step="key === 'rating' ? '0.1' : undefined"
                    :placeholder="field.placeholder"
                  />
                </template>
              </div>

              <div>
                <Label>Photo</Label>
                <div class="flex flex-wrap gap-2 mt-1">
                  <div
                    v-for="(img, index) in images"
                    :key="index"
                    class="relative"
                  >
                    <img :src="img" class="w-20 h-20 object-cover rounded" />
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="mt-2"
                />
                <Button type="button" @click="uploadNewImage" class="mt-2">
                  Add photo
                </Button>
              </div>

              <DialogFooter class="pt-4">
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <div class="mt-8">
        <h2 class="text-xl font-bold">Hotel room</h2>
        <div v-if="hotel.rooms && hotel.rooms.length">
          <RoomDetail
            v-for="(room, index) in hotel.rooms"
            :key="index"
            :hotelId="hotelId"
            :roomIndex="index"
            @room-updated="fetchHotelData"
          />
        </div>
        <div v-else>
          <p>No rooms available</p>
        </div>
      </div>
    </div>

    <div v-else>
      <p>Loading hotel details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
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
import { FORM_ROOM_NAME } from '@/routerPath';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import RoomDetail from '../../components/hotels/RoomDetail.vue';
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
const route = useRoute();
const hotelId = route.params.id as string;
const hotel = ref<any | null>(null);
const dialogOpen = ref(false);
const images = ref<string[]>([]);
const AMENITIES_KEY = 'amenities';
const editableFields = ref<
  Record<string, { label: string; value: any; placeholder?: string }>
>({});
const storage = getStorage();
const newImageFile = ref<File | null>(null);

async function fetchHotelData() {
  const docRef = doc(db, 'hotels', hotelId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    hotel.value = docSnap.data();
    images.value = hotel.value.images || [];
    editableFields.value = {
      name: { label: 'Name', value: hotel.value.name || '' },
      type: { label: 'Type', value: hotel.value.type || '' },
      email: { label: 'Email', value: hotel.value.email || '' },
      phone: { label: 'Phone number', value: hotel.value.phone || '' },
      address: { label: 'Address', value: hotel.value.address || '' },
      description: {
        label: 'Description',
        value: hotel.value.description || '',
      },
      rating: { label: 'Rating', value: hotel.value.rating || 1 },
      numberOfReviews: {
        label: 'Reviews',
        value: hotel.value.numberOfReviews || 0,
      },
      freeCancellationUpto24h: {
        label: 'Free Cancellation Up to 24h',
        value: hotel.value.freeCancellationUpto24h ?? false,
      },
    };
    editableFields.value.amenities = {
      label: 'Amenities',
      value: hotel.value.amenities ? [...hotel.value.amenities] : [],
    };
  }
}

onMounted(async () => {
  await fetchHotelData();
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    newImageFile.value = target.files[0];
  }
};

const uploadNewImage = async () => {
  if (!newImageFile.value) {
    toast({
      title: 'Error',
      description: 'Choose a photo',
      variant: 'destructive',
    });
    return;
  }
  try {
    const file = newImageFile.value;
    const fileName = `${Date.now()}_${file.name}`;
    const imageRef = storageRef(storage, `hotel-images/${fileName}`);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    images.value.push(downloadURL);
    await updateDoc(doc(db, 'hotels', hotelId), {
      images: arrayUnion(downloadURL),
    });
    toast({ title: 'success', description: 'Photo is submited' });
    newImageFile.value = null;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Photo is bot downloaded',
      variant: 'destructive',
    });
  }
};

function getFilePathFromURL(downloadURL: string): string {
  const match = downloadURL.match(/\/o\/(.*?)\?/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return '';
}

const removeImage = async (index: number) => {
  const downloadURL = images.value[index];
  try {
    const filePath = getFilePathFromURL(downloadURL);
    if (filePath) {
      const fileRef = storageRef(storage, filePath);
      await deleteObject(fileRef);
    }
    images.value.splice(index, 1);
    await updateDoc(doc(db, 'hotels', hotelId), {
      images: arrayRemove(downloadURL),
    });
    toast({ title: 'success', description: 'Photo is deleted' });
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Photo is not deleted',
      variant: 'destructive',
    });
  }
};

const updateHotel = async () => {
  const updatedData: Record<string, any> = {};
  for (const [key, field] of Object.entries(editableFields.value)) {
    updatedData[key] = ['rating', 'numberOfReviews'].includes(key)
      ? Number(field.value)
      : field.value;
  }
  updatedData.images = images.value;
  try {
    await updateDoc(doc(db, 'hotels', hotelId), updatedData);
    toast({ title: 'Success', description: 'Hotel is updated' });
    hotel.value = { ...hotel.value, ...updatedData };
    dialogOpen.value = false;
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Update is not successfull',
      variant: 'destructive',
    });
  }
};
</script>
