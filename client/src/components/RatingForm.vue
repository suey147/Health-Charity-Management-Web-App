<template>
    <div class="card shadow-5-strong">
      <div class="card-body py-5 px-md-3">
        <div class="d-flex justify-content-center align-items-center">
          <h1 class="mb-0">{{ props.initialRating[0] }}</h1>
          <span class="mx-2">/5</span>
        </div>
        <div class="d-flex justify-content-center align-items-center">
          <form @submit.prevent="sumbitVote">
            <div class="form-group">
              <label for="rating">Rate this article</label>
              <div id="rating" class="d-flex">
                <span v-for="star in stars" :key="star" class="star" @click="setRating(star)" :class="{'text-warning': star <= currentRating, 'text-muted': star > currentRating}">
                  ★
                </span>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3" v-if="!rated">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    import { defineProps } from 'vue';
    import axios from 'axios'
    const props = defineProps({
      initialRating: {
        type: Array
      },
      docId: {
        type: String
      },
      category: {
        type: String
      }
    })
    const stars = ref([1, 2, 3, 4, 5]);
    const currentRating = ref(0);
    const rated = ref(false);

    const setRating = (star) => {
        currentRating.value = star;
      };
    
    const sumbitVote = async () => {
      try {
          const newRating = calculateRate();
          const response = await axios.post('http://localhost:5000/updateRating', {category: props.category ,documentID: props.docId, rating: newRating });
          rated.value = true;
      } catch (error){
          console.log('Error: '+error.message);
          return [];
      }
    }

    const calculateRate = () => {
      const sumOfVotes = props.initialRating[1];
      const initial = props.initialRating[0];

      if (sumOfVotes == 0){
        return currentRating;
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
  