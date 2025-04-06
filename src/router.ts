// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'

import Hotel from './pages/hotels/Hotel.vue';
import HotelDetail from '@/pages/hotels/HotelDetail.vue';
import FormRoom from '@/pages/hotels/FormRoom.vue';
import AddHotel from '@/pages/hotels/AddHotel.vue';

import {
  HOME_NAME,
  HOME_ROUTE,
  HOTEL_DETAILS_NAME,
  HOTEL_DETAILS_ROUTE,
  FORM_ROOM_NAME,
  FORM_ROOM_ROUTE,
  ADD_HOTEL_NAME,
  ADD_HOTEL_ROUTE,
} from './routerPath';

const routes = [
  {
    path: HOME_ROUTE,
    name: HOME_NAME,
    component: Hotel,  },
  {
    path: HOTEL_DETAILS_ROUTE,
    name: HOTEL_DETAILS_NAME,
    component: HotelDetail,
  },
  {
    path: FORM_ROOM_ROUTE,
    name: FORM_ROOM_NAME,
    component: FormRoom,
  },
  {
    path: ADD_HOTEL_ROUTE,
    name: ADD_HOTEL_NAME,
    component: AddHotel,
  }
  
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router;