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
              @mouseover="hoverRating(star)"
              @mouseleave="resetRating"
              :class="{'text-warning': star <= currentRating || star <= hoverRating, 'text-muted': star > currentRating && star > hoverRating}"
            >
              ★
            </span>

            
          </div>
        </div>
        <!-- <div class="form-group mt-3">
          <label for="comments">Comments</label>
          <textarea
            id="comments"
            class="form-control"
            v-model="comments"
            rows="3"
            placeholder="Leave your comments here..."
          ></textarea>
        </div> -->
        <button type="submit" class="btn btn-primary mt-3">Submit</button>
      </form>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    import { defineProps } from 'vue';
    const props = defineProps({
        initialRating: {
            type: Number,
            default: 0,
        }
    })
    const stars = ref([1, 2, 3, 4, 5]);
    const currentRating = ref(0);
    const hoverRatingNum = ref(0);  

    const setRating = (star) => {
        currentRating.value = star;
      };
    const hoverRating = (star) => {
        hoverRatingNum.value = star;
    };

    const resetRating = () => {
        hoverRating.value = 0;
    };
    
    const submitForm = () => {
        // Handle form submission
        alert(`Rating: ${this.currentRating}`);
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
  