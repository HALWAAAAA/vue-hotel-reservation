// src/router.ts
import { createRouter, createWebHistory } from 'vue-router';

import Hotel from './pages/hotels/Hotel.vue';
import HotelDetail from '@/pages/hotels/HotelDetail.vue';
import FormRoom from '@/pages/hotels/FormRoom.vue';
import AddHotel from '@/pages/hotels/AddHotel.vue';
import Home from '../src/pages/user/Home.vue';
import SearchResult from './pages/user/SearchResult.vue';

import {
  HOME_NAME,
  HOME_ROUTE,
  HOTEL_DETAILS_NAME,
  HOTEL_DETAILS_ROUTE,
  FORM_ROOM_NAME,
  FORM_ROOM_ROUTE,
  ADD_HOTEL_NAME,
  ADD_HOTEL_ROUTE,
  USER_HOME_NAME,
  USER_HOME_ROUTE,
  USER_SEARCH_NAME,
  USER_SEARCH_ROUTE
} from './routerPath';

const routes = [
  {
    path: HOME_ROUTE,
    name: HOME_NAME,
    component: Hotel,
    meta: { layout: 'admin' },
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: HOTEL_DETAILS_ROUTE,
    name: HOTEL_DETAILS_NAME,
    component: HotelDetail,
    meta: { layout: 'admin' },
  },
  {
    path: FORM_ROOM_ROUTE,
    name: FORM_ROOM_NAME,
    component: FormRoom,
    meta: { layout: 'admin' },
  },
  {
    path: ADD_HOTEL_ROUTE,
    name: ADD_HOTEL_NAME,
    component: AddHotel,
    meta: { layout: 'admin' },
  },
  {
    path: USER_HOME_ROUTE,
    name: USER_HOME_NAME,
    component: Home,
    meta: { layout: 'user' },
  },
  {
    path: USER_SEARCH_ROUTE,
    name: USER_SEARCH_NAME,
    component: SearchResult,
    meta: { layout: 'user' },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
