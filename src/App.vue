<script setup>
  import NavBar from './components/NavBar.vue';
  import { knowledgeHubCollectionRef } from './firebase.js'
  import { getDocs, getDoc, collection, onSnapshot, query, where} from 'firebase/firestore';
  import { db } from './firebase.js'
  import { ref } from "vue";

  /**
   * Fetches documents from the 'knowledgeHub' collection and categorizes them.
   * @async
   * @function getDocuments
   */
  const getDocuments = async () => {
    const q = query(collection(db, "knowledgeHub"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        categorizedDocuments(documents);
    });
  }

  /**
   * Categorizes documents by their category field and stores them in localStorage.
   * @function categorizedDocuments
   * @param {Array<Object>} documents - Array of document objects to categorize.
   */
  const categorizedDocuments = (documents) => {
    const categorized = documents.reduce((acc, doc) => {
      const category = doc.category;
      if(!acc[category]){
        acc[category] = [];
      }
      acc[category].push(doc);
      return acc;
    }, {});
    const allDocs = Object.keys(categorized).map(category => ({
      category,
      id: category,
      documents: categorized[category]
    }));
    localStorage.setItem('documents', JSON.stringify(allDocs));
  }
  getDocuments()
</script>

<template>
  <header>
    <NavBar/>
  </header>

  <main>
    <router-view></router-view>
  </main>
</template>

<style scoped>
</style>
