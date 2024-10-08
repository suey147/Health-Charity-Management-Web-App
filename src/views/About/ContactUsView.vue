<template>
  <div class="container mt-5">
    <div class="col-md-8 offset-md-2">
      <div
        class="card mx-4 mx-md-5 shadow-5-strong bg-success-subtle"
        style="backdrop-filter: blur(30px)"
      >
        <div class="card-body py-5 px-md-5">
          <h1 class="text-center">Contact Us</h1>
          <form>
            <div class="row mb-3">
              <div class="col-md-12 col-sm-12 col-12">
                <label for="fname" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="fname"
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
                />
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-12 col-sm-12 col-12">
                <label for="message" class="form-label">Message</label>
                <textarea class="form-control" id="message" rows="5"></textarea>
              </div>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref } from "vue";

</script>

<style scoped>


</style>