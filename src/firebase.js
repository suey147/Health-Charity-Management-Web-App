import { initializeApp } from 'firebase/app'
import { getFirestore, doc, connectFirestoreEmulator } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'
/**
 * Firebase configuration object.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCEOUmcoVEq9sVhiiKbEIq29nN5cOJaZMg",
  authDomain: "fit5032-assignment-ce36f.firebaseapp.com",
  projectId: "fit5032-assignment-ce36f",
  storageBucket: "fit5032-assignment-ce36f.appspot.com",
  messagingSenderId: "242934523693",
  appId: "1:242934523693:web:1edc44e6b9d91d7c9155a4",
  databaseURL: "https://fit5032-assignment-ce36f-default-rtdb.firebaseio.com/"
};

/**
 * Initializes the Firebase application with the provided configuration.
 */
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const database = getDatabase(firebaseApp);

// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }
export default firebaseApp

/**
 * Firestore database instance.
 */
export {db, database};

/**
 * Reference to the 'knowledgeHub' collection and 'documents' document in Firestore.
 */
export const knowledgeHubCollectionRef = doc(db, 'knowledgeHub', 'documents');