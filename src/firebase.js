import { initializeApp } from 'firebase/app'
import { getFirestore, doc  } from "firebase/firestore";

/**
 * Firebase configuration object.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCEOUmcoVEq9sVhiiKbEIq29nN5cOJaZMg",
  authDomain: "fit5032-assignment-ce36f.firebaseapp.com",
  projectId: "fit5032-assignment-ce36f",
  storageBucket: "fit5032-assignment-ce36f.appspot.com",
  messagingSenderId: "242934523693",
  appId: "1:242934523693:web:1edc44e6b9d91d7c9155a4"
};

/**
 * Initializes the Firebase application with the provided configuration.
 */
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp


/**
 * Firestore database instance.
 */
export const db = getFirestore(firebaseApp)

/**
 * Reference to the 'knowledgeHub' collection and 'documents' document in Firestore.
 */
export const knowledgeHubCollectionRef = doc(db, 'knowledgeHub', 'documents');