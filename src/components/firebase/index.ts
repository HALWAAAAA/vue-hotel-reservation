import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCLSPLZJFquLRy-l_7POOXF3ozUmMWgK_k',
  authDomain: 'diploma-6912a.firebaseapp.com',
  projectId: 'diploma-6912a',
  storageBucket: 'diploma-6912a.firebasestorage.app',
  messagingSenderId: '962869975716',
  appId: '1:962869975716:web:da48c63bf5569783d26431',
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp);

export {
  db,
  firebaseApp
}
