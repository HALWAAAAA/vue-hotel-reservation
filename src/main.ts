import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import { router } from './router';
import { firebaseApp,  } from './components/firebase/index.ts';
import { VueFire, VueFireFirestoreOptionsAPI, VueFireAuth } from 'vuefire';
import 'leaflet/dist/leaflet.css';
import Spinner from './components/ui/MyUi/Spinner.vue';
const pinia = createPinia();
const app = createApp(App);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireFirestoreOptionsAPI(), VueFireAuth()],
});
app.use(router);
app.use(pinia);
app.component('Spinner', Spinner);
app.mount('#app');
