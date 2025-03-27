import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { firebaseApp } from './components/firebase/index.ts'
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'

const app = createApp(App)
app.use(router)
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireFirestoreOptionsAPI()],
})

app.mount('#app')
