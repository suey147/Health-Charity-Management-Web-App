<template>
  <Toast />
  <div class="container mt-5">
    <div class="col-md-8 offset-md-2">
      <div
        class="card mx-4 mx-md-5 shadow-5-strong bg-success-subtle"
        style="backdrop-filter: blur(30px)"
      >
        <div class="card-body py-5 px-md-5">
          <h1 class="text-center">Donation</h1>
          <form @submit.prevent="makeDonation">
            <!-- One time or monthly -->
            <div class="row mb-3">
                <div class="col-md-12 col-sm-12 col-12 text-center">
                    <SelectButton v-model="value" :options="paymentTime" aria-labelledby="basic" severity="success"/>
                </div>
                  
            </div>
            <div class="row mb-3">
                <div class="col-md-12 col-sm-12 col-12  text-center">
                  <SelectButton v-model="value" :options="donateValue" aria-labelledby="basic" />
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-12 col-sm-12 col-12">
                  <input
                    type="number"
                    class="form-control"
                    id="custom-amount"
                    placeholder="$"
                    v-model="formData.customAmount"
                    required
                  />
                </div>
            </div>
            <h3 class="text-center">Your Details</h3>
            <div class="row mb-3">
              <div class="col-md-6 col-sm-6 col-6">
                <label for="fname" class="form-label">First Nname</label>
                <input
                  type="text"
                  class="form-control"
                  id="fname"
                  v-model="formData.fname"
                />
              </div>
              <div class="col-md-6 col-sm-6 col-6">
                  <label for="lname" class="form-label">Last Nname</label>
                  <input
                    type="text"
                    class="form-control"
                    id="lname"
                    v-model="formData.lname"
                  />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-12 col-sm-12 col-12">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="formData.email"
                />
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-12 col-sm-12 col-12">
                <label for="message" class="form-label">Message</label>
                <textarea class="form-control" id="message" v-model="formData.message" rows="3"></textarea>
              </div>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2">Donate Now</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import router from "@/router";
  import Toast from "primevue/toast";

  const value = ref('One-time');
  const paymentTime = ref(['One-time', 'Monthly']);
  const donateValue = ref(['30', '50', '100', '200', '500']);
  const formData = ref({
    customAmount: null,
    fname: "",
    lname: "",
    email: "",
    message: ""
  })

  const makeDonation = () => {
    router.push({ name: 'Payment' })
  }
  
</script>

<style scoped>
.custom-radius {
  border-radius: 20px; /* Change this value to whatever radius you want */
}
</style>