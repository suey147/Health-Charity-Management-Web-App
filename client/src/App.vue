<script setup>
  import NavBar from './components/NavBar.vue';
  import { knowledgeHubCollectionRef } from './firebase.js'
  import { getDocs, getDoc, collection, onSnapshot, query, where} from 'firebase/firestore';
  import { db } from './firebase.js'
  import { ref } from "vue";

  const getDocuments = async () => {
    // const collectionRef = collection(db, "knowledgeHub");
    // const fetchDoc = await getDocs(collectionRef);
    // if (fetchDoc){
    //   const documents = fetchDoc.docs.map(doc => ({id: doc.id, ...doc.data()}));
    //   categorizedDocuments(documents)
    // }
    const q = query(collection(db, "knowledgeHub"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        categorizedDocuments(documents);
    });
  }
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
      documents: categorized[category]
    }));
    console.log(allDocs)
    localStorage.setItem('documents', JSON.stringify(allDocs));
  }
  getDocuments()

</script>

<template>
  <header>
    <NavBar/>
  </header>

  <main>
    <div class="container mt-5">
        <div class="row">
            <!-- <div class="col-md-8 offset-md-2"> -->
              <router-view></router-view>
            <!-- </div> -->
        </div>
    </div>
  </main>
</template>

<style scoped>

</style>
