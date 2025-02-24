import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA0xwE6zWd8cthVtwBdZFVQcaWLw66cEpA',
  authDomain: 'calendar12-736e3.firebaseapp.com',
  databaseURL:
    'https://calendar12-736e3-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'calendar12-736e3',
  storageBucket: 'calendar12-736e3.firebasestorage.app',
  messagingSenderId: '395909597',
  appId: '1:395909597:web:77ce885b7093d77c943e34',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
