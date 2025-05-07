import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import { router } from './router';
import { firebaseApp } from './components/firebase/index.ts';
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire';
import 'leaflet/dist/leaflet.css';
const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireFirestoreOptionsAPI()],
});
app.use(pinia);
app.mount('#app');
