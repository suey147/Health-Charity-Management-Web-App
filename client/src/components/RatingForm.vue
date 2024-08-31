<template>
    <div class="container mt-5">
      <h2>Rate this article</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="rating">Rating</label>
          <div id="rating" class="d-flex">
            <!-- Loop through the rating options -->
            <span
              v-for="star in stars"
              :key="star"
              class="star"
              @click="setRating(star)"
              :class="{'text-warning': star <= currentRating, 'text-muted': star > currentRating}"
            >
              ★
            </span>

            
          </div>
        </div>
        <button type="submit" class="btn btn-primary mt-3">Submit</button>
      </form>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    import { defineProps } from 'vue';
    const props = defineProps({
      initialRating: {
          type: String,
      }
    })
    const stars = ref([1, 2, 3, 4, 5]);
    const currentRating = ref(0);

    const setRating = (star) => {
        currentRating.value = star;
      };
    
    const submitForm = () => {
        // Reset form fields
        currentRating.value = 0;
    }
  </script>
  
  <style scoped>
  .star {
    font-size: 2rem;
    cursor: pointer;
  }
  </style>
  