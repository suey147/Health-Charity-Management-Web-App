<template>
  <div class="admin-dashboard container">
    <h1>Admin Dashboard</h1>
    <div class="col-md-12 col-sm-12 col-12 text-center">
      <SelectButton v-model="value" :options="options" aria-labelledby="basic" severity="success" />
    </div>
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
            <p class="card-text">{{ userStats.volunteer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Knowledge Hub Overview -->
    <div class="row mb-4">
      <div class="col-md-12">
        <h3>User Statistics</h3>
        <canvas id="userStatsChart"></canvas>
      </div>
    </div>

    <button type="submit" class="btn btn-primary" @click="sendBulkEmail">Submit</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { db } from '../firebase' // Import Firebase configuration
import { doc, getDoc } from 'firebase/firestore'
import Chart from 'chart.js/auto'
import SelectButton from 'primevue/selectbutton'
import axios from 'axios'


    const options = ref(['User', 'KnowledgeHub'])
    const value = ref('User')
    const userStats = ref({
      donor: 0,
      participant: 0,
      volunteer: 0
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
        const userDocRef = doc(db, 'Count', 'users')
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          userStats.value = userDocSnap.data()
          console.log(userStats.value)
          createUserStatsChart(userStats.value)
        }

        const knowledgeHubDocRef = doc(db, 'Count', 'knowledgeHub')
        const knowledgeHubDocSnap = await getDoc(knowledgeHubDocRef)
        if (knowledgeHubDocSnap.exists()) {
          knowledgeHubStats.value = knowledgeHubDocSnap.data()
          // createKnowledgeHubChart(knowledgeHubStats.value)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    const sendBulkEmail = async () => {
      const users = ['sueysueyho147@gmail.com', 'hlau0017@student.monash.edu']
      const send = await axios.post('http://localhost:3000/sendBulkEmail', { users: users })
    }

    const createUserStatsChart = (data) => {
      const ctx = document.getElementById('userStatsChart').getContext('2d')
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Donors', 'Participants', 'Volunteers'],
          datasets: [
            {
              label: 'Number of Users',
              data: [data.donor, data.participant, data.volunteers],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }

    // Fetch data on component mount
    onMounted(() => {
      fetchData()
    })
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.card {
  margin: 20px 0;
}
</style>
