import { createRouter, createWebHashHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';
import Hotel from './pages/hotels/Hotel.vue';
import HotelDetail from '@/pages/hotels/HotelDetail.vue';
import FormRoom from '@/pages/hotels/FormRoom.vue';
import AddHotel from '@/pages/hotels/AddHotel.vue';
import Home from '../src/pages/user/Home.vue';
import SearchResult from './pages/user/SearchResult.vue';
import UserHotelDetail from './pages/user/UserHotelDetail.vue';
import Register from './pages/user/Register.vue';
import Login from './pages/user/Login.vue';
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
  USER_SEARCH_ROUTE,
  USER_HOTEL_CARD_NAME,
  USER_HOTEL_CARD_ROUTE,
  USER_LOGIN_NAME,
  USER_LOGIN_ROUTE,
  USER_REGISTER_NAME,
  USER_REGISTER_ROUTE,
  USER_BOOK_NAME,
  USER_BOOK_ROUTE,
  HOTEL_REQUESTS_NAME,
  HOTEL_REQUESTS_ROUTE,
  USER_PROFILE_NAME,
  USER_PROFILE_ROUTE,
  USER_FOLLOWED_NAME,
  USER_FOLLOWED_ROUTE,
  USER_TERMS_NAME,
  USER_TERMS_ROUTE,
  USER_REVIEW_NAME,
  USER_REVIEW_ROUTE,
  USER_PAYMENT_ROUTE,
  USER_PAYMENT_NAME,
  USER_PAYMENT_CONFIRMED_NAME,
  USER_PAYMENT_CONFIRMED_ROUTE,
} from './routerPath';
import BookingPage from './pages/user/BookingPage.vue';
import Requests from './pages/hotels/Requests.vue';
import ProfilePage from './pages/user/ProfilePage.vue';
import FollowedPage from './pages/user/FollowedPage.vue';
import Terms from './pages/user/Terms.vue';
import Review from './pages/user/Review.vue';
import PaymentPage from '@/pages/user/PaymentPage.vue';
import PaymentConfirmedPage from '@/pages/user/PaymentConfirmedPage.vue';

const routes = [
  {
    path: HOME_ROUTE,
    name: HOME_NAME,
    component: Hotel,
    meta: { layout: 'admin', requiresAdmin: true },
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: USER_FOLLOWED_ROUTE,
    name: USER_FOLLOWED_NAME,
    component: FollowedPage,
    meta: { layout: 'user' },
  },
  {
    path: HOTEL_DETAILS_ROUTE,
    name: HOTEL_DETAILS_NAME,
    component: HotelDetail,
    meta: { layout: 'admin' },
  },
  {
    path: HOTEL_REQUESTS_ROUTE,
    name: HOTEL_REQUESTS_NAME,
    component: Requests,
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
  {
    path: USER_HOTEL_CARD_ROUTE,
    name: USER_HOTEL_CARD_NAME,
    component: UserHotelDetail,
    meta: { layout: 'user' },
  },
  {
    path: USER_REGISTER_ROUTE,
    name: USER_REGISTER_NAME,
    component: Register,
    meta: { layout: 'user' },
  },
  {
    path: USER_LOGIN_ROUTE,
    name: USER_LOGIN_NAME,
    component: Login,
    meta: { layout: 'user' },
  },
  {
    path: USER_BOOK_ROUTE,
    name: USER_BOOK_NAME,
    component: BookingPage,
    meta: { layout: 'user', requiresAuth: true },
  },
  {
    path: USER_PROFILE_ROUTE,
    name: USER_PROFILE_NAME,
    component: ProfilePage,
    meta: { layout: 'user', requiresAuth: true },
  },
  {
    path: USER_TERMS_ROUTE,
    name: USER_TERMS_NAME,
    component: Terms,
    meta: { layout: 'user' },
  },
  {
    path: USER_REVIEW_ROUTE,
    name: USER_REVIEW_NAME,
    component: Review,
    meta: { layout: 'user', requiresAuth: true },
  },
  {
    path: USER_PAYMENT_ROUTE,
    name: USER_PAYMENT_NAME,
    component: PaymentPage,
    meta: { layout: 'user', requiresAuth: true },
  },
  {
    path: USER_PAYMENT_CONFIRMED_ROUTE,
    name: USER_PAYMENT_CONFIRMED_NAME,
    component: PaymentConfirmedPage,
    meta: { layout: 'user', requiresAuth: true },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to) => {
  // routes with `meta: { requiresAuth: true }` will check for
  // the users, others won't
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser()
    // if the user is not logged in, redirect to the login page
    if (!currentUser) {
      return {
        path: USER_LOGIN_ROUTE,
        query: {
          // we keep the current path in the query so we can
          // redirect to it after login with
          // `router.push(route.query.redirect || '/')`
          redirect: to.fullPath,
        },
      }
    }
  }
})
export default router;
