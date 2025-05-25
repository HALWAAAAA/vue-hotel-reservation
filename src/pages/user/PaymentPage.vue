<template>
  <div class="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    <div class="lg:col-span-2 space-y-6">
      <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Your Booking</h2>
        <p class="text-gray-600 mb-1">Room Type: {{ roomId }}</p>
        <p class="text-gray-600 mb-1">Hotel: {{ hotelId }}</p>
        <p class="text-gray-600 mb-4">
          Dates: {{ startDate }} - {{ endDate }} ({{ nights }} nights)
        </p>
        <p class="text-2xl font-semibold text-gray-800">
          Total: zł {{ total }}
        </p>
      </div>
    </div>

    
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Add a new payment method to your account.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
          <RadioGroup default-value="card" class="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem id="card" value="card" class="peer sr-only" />
              <Label for="card"
                class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" class="mb-3 h-6 w-6">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                Card
              </Label>
            </div>
            <div>
              <RadioGroupItem id="paypal" value="paypal" class="peer sr-only" disabled />
              <Label for="paypal"
                class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-not-allowed opacity-50">
                <svg role="img" viewBox="0 0 24 24" class="mb-3 h-6 w-6">
                  <path
                    d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"
                    fill="currentColor" />
                </svg>
                Paypal
              </Label>
            </div>
            <div>
              <RadioGroupItem id="apple" value="apple" class="peer sr-only" disabled />
              <Label for="apple"
                class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-not-allowed opacity-50">
                <svg role="img" viewBox="0 0 24 24" class="mb-3 h-6 w-6">
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    fill="currentColor" />
                </svg>
                Apple
              </Label>
            </div>
          </RadioGroup>

          <div class="grid gap-2">
            <Label for="name">Name</Label>
            <Input id="name" placeholder="First Last" v-model="cardholderName" />
          </div>
          <div class="grid gap-2">
            <Label for="card-number">Card number</Label>
            <Input id="card-number" placeholder="•••• •••• •••• ••••" v-model="cardNumber" />
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="grid gap-2">
              <Label for="month">Expires</Label>
              <Select v-model="expiryMonth">
                <SelectTrigger id="month">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">January</SelectItem>
                  <SelectItem value="2">February</SelectItem>
                  <SelectItem value="3">March</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">May</SelectItem>
                  <SelectItem value="6">June</SelectItem>
                  <SelectItem value="7">July</SelectItem>
                  <SelectItem value="8">August</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2">
              <Label for="year">Year</Label>
              <Select v-model="expiryYear">
                <SelectTrigger id="year">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="n in 10" :key="n" :value="String(new Date().getFullYear() + n -1)">
                    {{ new Date().getFullYear() + n - 1 }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2">
              <Label for="cvc">CVC</Label>
              <Input id="cvc" placeholder="CVC" v-model="cvc" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button class="w-full" @click="handlePayment" :disabled="payed"> Confirm Payment </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/components/firebase';
import { toast } from '@/components/ui/toast';
import { USER_PAYMENT_CONFIRMED_NAME } from '@/routerPath';

const hotelId = useRouteQuery('hotelId');
const roomId = useRouteQuery('roomId');
const startDate = useRouteQuery('startDate');
const endDate = useRouteQuery('endDate');
const guests = useRouteQuery('guests');
const nights = useRouteQuery('nights');
const total = useRouteQuery('total');
const customerEmail = useRouteQuery('customerEmail');

const payed = ref(false);

const cardholderName = ref('');
const cardNumber = ref('');
const expiryMonth = ref('');
const expiryYear = ref('');
const cvc = ref('');

const router = useRouter();

async function handlePayment() {
  payed.value =true;
  const paymentDetails = {
    app_name: "vue-hotel-reservation",
    service: "hotel_booking",
    customer_email: customerEmail.value,
    card_type: "VISA", 
    card_holder_name: cardholderName.value,
    card_number: cardNumber.value,
    expiryMonth: expiryMonth.value,
    expiryYear: expiryYear.value,
    cvv: cvc.value,
    amount: Number(total.value), 
    currency: "PLN",
  };

  try {
    const response = await axios.post("http://localhost:3000/api/payments", paymentDetails);

   
    console.log("Payment successful:", response.data);
    
    const paymentId = response.data?.id; 

    if (!paymentId) {
      console.error("Payment ID not found in response:", response.data);
      toast({
        title: 'Payment Error',
        description: 'Payment ID was not returned by the payment gateway.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'bookings'), {
        hotelId: hotelId.value,
        roomId: roomId.value,
        startDate: startDate.value,
        endDate: endDate.value,
        guests: Number(guests.value),
        nights: Number(nights.value),
        total: Number(total.value),
        customerEmail: customerEmail.value,
        paymentId: paymentId,
        payment:response.data,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Payment Successful!',
        description: 'Your booking is confirmed.',
      });

      setTimeout(() => {
        router.push({ name: USER_PAYMENT_CONFIRMED_NAME });
      }, 2000);

    } catch (dbError) {
      console.error("Error saving booking to Firestore:", dbError);
      toast({
        title: 'Booking Error',
        description: 'Your payment was successful, but we could not save your booking. Please contact support.',
        variant: 'destructive',
      });
      payed.value =false;
    }

  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Payment failed:", error.response.data);
      toast({
        title: 'Payment Failed',
        description: error.response.data?.message || 'Please try again.', 
        variant: 'destructive',
      });
    } else {
      console.error("Error during payment processing:", error);
      toast({
        title: 'Payment Error',
        description: 'An unexpected error occurred during payment. Please try again.',
        variant: 'destructive',
      });
      payed.value =false;
    }
    
  }
}
</script>
