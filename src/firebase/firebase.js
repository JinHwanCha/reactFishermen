import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, onValue, runTransaction } from 'firebase/database';
import firebaseConfig from './config';

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get, set, onValue, runTransaction };
