<template>
    <div class="admin-dashboard container">
      <h1>Admin Dashboard</h1>
  
      <!-- Overview Cards for Users -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">Number of Donors</h5>
              <p class="card-text">{{ userStats.donor }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">Number of Participants</h5>
              <p class="card-text">{{ userStats.participant }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">Number of Volunteers</h5>
              <p class="card-text">{{ userStats.volunteers }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Knowledge Hub Overview -->
      <div class="row">
        <div class="col-md-12">
          <h3>Knowledge Hub Categories</h3>
          <canvas id="knowledgeHubChart"></canvas>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue'
  import { db } from '../firebase' // Import Firebase configuration
  import { doc, getDoc } from 'firebase/firestore'
  import Chart from 'chart.js/auto'
  
  export default {
    setup() {
      // State variables for the dashboard
      const totalUsers = ref(0)
      const donorCount = ref(0)
      const volunteerCount = ref(0)
  
      const userStats = ref({
        donor: 0,
        participant: 0,
        volunteers: 0
      })
  
      const knowledgeHubStats = ref({
        funding: 0,
        health: 0,
        family: 0
      })
  
      // Fetch data from Firebase
      const fetchData = async () => {
        try {
          // Get users data
          const userDocRef = doc(db, 'collect', 'users')
          const userDocSnap = await getDoc(userDocRef)
          if (userDocSnap.exists()) {
            userStats.value = userDocSnap.data()
          }
  
          const knowledgeHubDocRef = doc(db, 'collect', 'knowledgehub')
          const knowledgeHubDocSnap = await getDoc(knowledgeHubDocRef)
          if (knowledgeHubDocSnap.exists()) {
            knowledgeHubStats.value = knowledgeHubDocSnap.data()
            createKnowledgeHubChart(knowledgeHubStats.value)
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
        }
      }
  
      // Create Page Views Chart
      //   const createPageViewsChart = (data) => {
      //     const ctx = document.getElementById('pageViewsChart').getContext('2d');
      //     new Chart(ctx, {
      //       type: 'bar',
      //       data: {
      //         labels: Object.keys(data),
      //         datasets: [{
      //           label: 'Page Views',
      //           data: Object.values(data),
      //           backgroundColor: 'rgba(75, 192, 192, 0.2)',
      //           borderColor: 'rgba(75, 192, 192, 1)',
      //           borderWidth: 1
      //         }]
      //       }
      //     });
      //   };
  
      // Create Knowledge Hub Usage Chart
      const createKnowledgeHubChart = (data) => {
        const ctx = document.getElementById('knowledgeHubChart').getContext('2d')
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(data),
            datasets: [
              {
                label: 'Knowledge Hub Usage',
                data: Object.values(data),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                borderWidth: 1
              }
            ]
          }
        })
      }
  
      // Fetch data on component mount
      onMounted(() => {
        fetchData()
      })
  
      return {
        userStats,
        knowledgeHubStats
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-dashboard {
    padding: 20px;
  }
  
  .card {
    margin: 20px 0;
  }
  </style>
  