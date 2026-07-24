import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Firebase Console > プロジェクトの設定 > 全般 > マイアプリ で作成したウェブアプリの設定値に
// 置き換えてください。ここは公開情報（APIキーではなくプロジェクト識別情報）のため
// リポジトリに含めても問題ありませんが、書き込みは Firestore ルールと Auth で保護しています。
export const firebaseConfig = {
  apiKey: "AIzaSyDxsNCxq_2CQFXm_3ZPwDrFwAMq8BJnpHM",
  authDomain: "map1-99057.firebaseapp.com",
  projectId: "map1-99057",
  storageBucket: "map1-99057.firebasestorage.app",
  messagingSenderId: "586857800277",
  appId: "1:586857800277:web:8cd6508a48f61819802adc",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const MARKS_COLLECTION = "marks";
export const marksCollectionRef = collection(db, MARKS_COLLECTION);

export {
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
};
