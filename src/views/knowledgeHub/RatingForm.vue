<template>
    <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Rating</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="sumbitVote">
            <h1 class="card-title pricing-card-title">{{ initialRating[0] }} <small class="text-muted">/ 5</small></h1>
            <ul class="list-unstyled mt-3 mb-4">
                <p>What do you think about this article? Rate this article!</p>
                <span v-for="star in stars" :key="star" class="star" @click="setRating(star)" :class="{'text-warning': star <= currentRating, 'text-muted': star > currentRating}">
                  ★
                </span>
            </ul>
            <button type="submit" class="btn btn-lg btn-block btn-primary" v-if="!rated">Submit</button>
            <p v-if="rated">You have successfully rated this articles</p>
            </form>
          </div>
          
        </div>
  </template>
  
  <script setup>
    import { ref, onMounted, defineProps, watch } from 'vue';
    import { doc, updateDoc } from 'firebase/firestore';
    import { db } from '../../firebase.js'
    const props = defineProps({
      docId: {
        type: String
      }
    })
    const stars = ref([1, 2, 3, 4, 5]);
    const currentRating = ref(0);
    const rated = ref(false);
    const initialRating = ref([0,0]);

    onMounted(() => {
      updateRating()
    });

    const updateRating = () => {
        const fromLocal = JSON.parse(localStorage.getItem('documents'));
        const doc = fromLocal.flatMap((category) => category.documents).find(doc => doc.id === props.docId);
        initialRating.value = doc.rating;
        console.log(initialRating)
    }

    const setRating = (star) => {
        currentRating.value = star;
      };
    
    const sumbitVote = async () => {
      try {
          const newRating = calculateRate();
          console.log(newRating)
          const documentRef = doc(db, 'knowledgeHub', props.docId)
          const result = await updateDoc(documentRef, { rating: newRating});
          rated.value = true;
          updateRating();
      } catch (error){
          console.log('Error: '+error.message);
          return [];
      }
    }

    const calculateRate = () => {
      const sumOfVotes = initialRating.value[1];
      const initial = initialRating.value[0];

      if (sumOfVotes == 0){
        return [currentRating.value, 1];
      }

      const newAverageRating = ((initial * sumOfVotes) + currentRating.value) / (sumOfVotes + 1);

      return [newAverageRating.toFixed(2), (sumOfVotes + 1)];
    }
  </script>
  
  <style scoped>
  .star {
    font-size: 2rem;
    cursor: pointer;
  }
  </style>
  