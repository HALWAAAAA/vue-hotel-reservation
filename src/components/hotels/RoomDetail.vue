<script setup lang="ts">
import { ref, computed, onMounted, watch, defineEmits } from 'vue';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/components/firebase';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { toast } from '@/components/ui/toast';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field } from 'vee-validate';

const props = defineProps<{
  hotelId: string;
  roomIndex: number;
}>();
const emit = defineEmits(['room-updated']);

const dialogOpen = ref(false);
const hotelData = ref<any>(null);
const roomImages = ref<string[]>([]);
const newRoomImageFile = ref<File | null>(null);

const editFields = ref({
  accommodationType: '',
  basePrice: 0,
  maxGuests: 1,
  startDate: '',
  endDate: '',
});

const room = computed(() => {
  if (!hotelData.value) return null;
  return hotelData.value.rooms[props.roomIndex];
});

async function fetchHotelData() {
  const docRef = doc(db, 'hotels', props.hotelId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    hotelData.value = docSnap.data();
  }
}

function initRoomData() {
  roomImages.value = [...(room.value.images || [])];

  const hasRange = room.value?.available?.length > 0;

  editFields.value = {
    accommodationType: room.value.accommodationType || '',
    basePrice: room.value.basePrice || 0,
    maxGuests: room.value.maxGuests || 1,
    startDate: room.value.startDate || '',
    endDate: room.value.endDate || '',
  };
}

onMounted(async () => {
  await fetchHotelData();
  if (room.value) {
    initRoomData();
  }
});

watch(room, (newVal) => {
  if (newVal) {
    initRoomData();
  }
});

function handleRoomFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    newRoomImageFile.value = target.files[0];
  }
}

async function uploadRoomImage() {
  if (!newRoomImageFile.value) {
    toast({
      title: 'Error',
      description: 'Choose a photo',
      variant: 'destructive',
    });
    return;
  }
  try {
    const file = newRoomImageFile.value;
    const fileName = `${Date.now()}_${file.name}`;
    const storage = getStorage();
    const imageRef = storageRef(
      storage,
      `hotels/${props.hotelId}/rooms/${props.roomIndex}/${fileName}`
    );
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    roomImages.value.push(downloadURL);
    await updateRoomInFirestore({
      images: [...roomImages.value],
    });
    toast({ title: 'Good', description: 'Photo is downloaded' });
    newRoomImageFile.value = null;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Smth went wrong with photo, try again',
    });
  }
}

function getFilePathFromURL(downloadURL: string): string {
  const match = downloadURL.match(/\/o\/(.*?)\?/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return '';
}

async function removeRoomImage(index: number) {
  const downloadURL = roomImages.value[index];
  try {
    const filePath = getFilePathFromURL(downloadURL);
    if (filePath) {
      const storage = getStorage();
      const fileRef = storageRef(storage, filePath);
      await deleteObject(fileRef);
    }
    roomImages.value.splice(index, 1);
    await updateRoomInFirestore({
      images: [...roomImages.value],
    });
    toast({ title: 'Success', description: 'Photo is deleted' });
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Photo is not deleted',
      variant: 'destructive',
    });
  }
}

async function updateRoom() {
  try {
    await updateRoomInFirestore({
      accommodationType: editFields.value.accommodationType,
      basePrice: editFields.value.basePrice,
      maxGuests: editFields.value.maxGuests,
      startDate: editFields.value.startDate,
      endDate: editFields.value.endDate,
    });
    toast({ title: 'Success', description: 'Room is changed' });
    dialogOpen.value = false;
  } catch (error) {
    toast({ title: 'Error', description: 'Room is not updated' });
  }
}

async function updateRoomInFirestore(partialRoomData: Record<string, any>) {
  if (!hotelData.value) return;
  const updatedRooms = [...hotelData.value.rooms];
  const updatedRoom = {
    ...updatedRooms[props.roomIndex],
    ...partialRoomData,
  };
  updatedRooms[props.roomIndex] = updatedRoom;
  await updateDoc(doc(db, 'hotels', props.hotelId), {
    rooms: updatedRooms,
  });
  hotelData.value.rooms = updatedRooms;
  emit('room-updated');
}

async function deleteRoom() {
  if (!hotelData.value) return;
  try {
    const updatedRooms = hotelData.value.rooms.filter(
      (_: any, idx: number) => idx !== props.roomIndex
    );
    await updateDoc(doc(db, 'hotels', props.hotelId), {
      rooms: updatedRooms,
    });
    toast({ title: 'Success', description: 'Room is deleted' });
    emit('room-updated');
  } catch (error) {
    toast({ title: 'Error', description: 'Room is not deleted' });
  }
}
</script>

<template>
  <div v-if="room">
    <div class="space-y-1">
      <p><strong>Accommodation Type:</strong> {{ room.accommodationType }}</p>

      <p><strong>Price per night:</strong> {{ room.basePrice }}</p>
      <p><strong>Max guests:</strong> {{ room.maxGuests }}</p>
      <p>
        <strong>Available:</strong>
        <template v-if="room.startDate">
          {{ room.startDate }} – {{ room.endDate }}
        </template>
      </p>
    </div>

    <div class="grid grid-cols-2 gap-2 mt-4">
      <img
        v-for="(img, i) in roomImages"
        :key="i"
        :src="img"
        class="w-full h-40 object-cover rounded"
      />
    </div>
    <Dialog v-model:open="dialogOpen">
      <DialogTrigger as-child>
        <Button variant="outline" class="mt-4"> Change data room </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change data room</DialogTitle>
          <DialogDescription> Change and Submit </DialogDescription>
        </DialogHeader>
        <ScrollArea class="max-h-[50vh] pr-4">
          <form @submit.prevent="updateRoom" class="space-y-3 pb-6">
            <Label for="accommodationType">Accommodation Type</Label>
            <Input
              id="accommodationType"
              v-model="editFields.accommodationType"
              placeholder="Single / Deluxe"
            />

            <Label for="basePrice">Price per night</Label>
            <Input
              id="basePrice"
              type="number"
              v-model="editFields.basePrice"
            />

            <Label>Max guests</Label>
            <Input type="number" v-model="editFields.maxGuests" />

            <Label>From</Label>
            <Input type="date" v-model="editFields.startDate" />

            <Label>To</Label>
            <Input type="date" v-model="editFields.endDate" />

            <div>
              <Label>Photo</Label>
              <div class="flex flex-wrap gap-2 mt-1">
                <div
                  v-for="(img, index) in roomImages"
                  :key="index"
                  class="relative"
                >
                  <img :src="img" class="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    @click="removeRoomImage(index)"
                    class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              </div>
              <input
                type="file"
                @change="handleRoomFileUpload"
                accept="image/*"
                class="mt-2"
              />
              <Button type="button" @click="uploadRoomImage" class="mt-2">
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

    <Button variant="destructive" class="mt-4" @click="deleteRoom">
      Delete room
    </Button>
  </div>
</template>
