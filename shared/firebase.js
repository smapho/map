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
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Firebase Console > プロジェクトの設定 > 全般 > マイアプリ で作成したウェブアプリの設定値に
// 置き換えてください。ここは公開情報（APIキーではなくプロジェクト識別情報）のため
// リポジトリに含めても問題ありませんが、書き込みは Firestore ルールと Auth で保護しています。
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
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
  onAuthStateChanged,
  signOut,
};
