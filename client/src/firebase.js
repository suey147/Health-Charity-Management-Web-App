import { initializeApp } from 'firebase/app'
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCEOUmcoVEq9sVhiiKbEIq29nN5cOJaZMg",
  authDomain: "fit5032-assignment-ce36f.firebaseapp.com",
  projectId: "fit5032-assignment-ce36f",
  storageBucket: "fit5032-assignment-ce36f.appspot.com",
  messagingSenderId: "242934523693",
  appId: "1:242934523693:web:1edc44e6b9d91d7c9155a4"
};
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp

//firestore refs
const knowledgeHubDB = getFirestore(firebaseApp)

export const knowledgeHubDBRef = collection(knowledgeHubDB, 'knowledgeHub')

// storage refs
export const knowledgeHubStorage = getStorage(firebaseApp);
