<template>
    <Toast />
    <div class="container mt-5">
      <div class="col-md-8 offset-md-2">
        <div
          class="card mx-4 mx-md-5 shadow-5-strong bg-success-subtle"
          style="backdrop-filter: blur(30px)"
        >
          <div class="card-body py-5 px-md-5">
            <h1 class="text-center">Payment</h1>
            <form @submit.prevent="payment">

              <div class="row mb-3">
                  <div class="col-md-12 col-sm-12 col-12">
                    <input
                      type="number"
                      class="form-control"
                      id="cardNumber"
                      placeholder="Card Number"
                      v-model="formData.cardNumber"
                      required
                    />
                  </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6 col-sm-6 col-6">
                  <label for="expirationDate" class="form-label">Expiration Date</label>
                  <input
                    type="text"
                    class="form-control"
                    id="expirationDate"
                    v-model="formData.expirationDate"
                  />
                </div>
                <div class="col-md-6 col-sm-6 col-6">
                    <label for="securityCode" class="form-label">Security Code</label>
                    <input
                      type="text"
                      class="form-control"
                      id="securityCode"
                      v-model="formData.securityCode"
                    />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-12 col-sm-12 col-12">
                  <label for="cardHolder" class="form-label">Card Holder</label>
                  <input
                    type="cardHolder"
                    class="form-control"
                    id="cardHolder"
                    v-model="formData.cardHolder"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-12 col-sm-12 col-12">
                    <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input">
                    <label class="form-check-label" for="flexCheckDefault">
                        Email the receipt to me
                    </label>
                </div>
              </div>

              
              <div class="text-center">
                <button type="submit" class="btn btn-primary me-2">Donate</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>
  
  <script setup>
    import { ref } from "vue";
    import Toast from "primevue/toast";
  
    const formData = ref({
        cardNumber: "",
        expirationDate: "",
        securityCode: "",
        cardHolder: "",
    })

    
  </script>
  
  <style scoped>
  </style>