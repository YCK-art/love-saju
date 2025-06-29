import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBw3cAOjGpOkamvqAuS3FKKMk1ZwrlDfhA",
  authDomain: "love-saju.firebaseapp.com",
  projectId: "love-saju",
  storageBucket: "love-saju.firebasestorage.app",
  messagingSenderId: "546149694730",
  appId: "1:546149694730:web:d64904917f859286e18ef3",
  measurementId: "G-7DRS2XFFSW"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Auth 및 Firestore 인스턴스 생성
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app; 