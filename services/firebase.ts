import { getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDy7TkmjusBVOOS7cTLCBidm4EFvsZCm3I",
  authDomain: "musicplaylist-435a4.firebaseapp.com",
  projectId: "musicplaylist-435a4",
  storageBucket: "musicplaylist-435a4.firebasestorage.app",
  messagingSenderId: "526442191936",
  appId: "1:526442191936:web:48ffe2653e9671159cd3a5"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
type AuthPersistence = NonNullable<NonNullable<Parameters<typeof FirebaseAuth.initializeAuth>[1]>['persistence']>;
const getReactNativePersistence = (FirebaseAuth as typeof FirebaseAuth & {
  getReactNativePersistence: (storage: typeof AsyncStorage) => AuthPersistence;
}).getReactNativePersistence;

function createAuth() {
  if (Platform.OS === 'web') {
    return FirebaseAuth.getAuth(app);
  }

  try {
    return FirebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if ((error as { code?: string }).code === 'auth/already-initialized') {
      return FirebaseAuth.getAuth(app);
    }
    throw error;
  }
}

export const auth = createAuth();
export const db = getFirestore(app);

