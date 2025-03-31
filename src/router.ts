// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'

// тут згодом можна довантажити компоненти
const routes = [
  {
    path: '/',
    component: () => import('./components/hotels/Hotel.vue'), // або головна
  },
  {
    path: '/hotels/:id',
    name: 'HotelDetails',
    component: () => import('./components/hotels/HotelDetail.vue'),
  },
  {
    path: '/hotels/:id/add-room',
    name: 'FormRoom',
    component: () => import('./components/hotels/FormRoom.vue'),
  },
  {
    path: '/admin/hotels/new',
    name: 'AddHotel',
    component: () => import('@/components/hotels/AddHotel.vue'),
  }
  
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
