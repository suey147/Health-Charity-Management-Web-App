<template>
    <div class="px-3 py-2 bg-dark text-white">
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <!-- logo -->
          <a href="/" class="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
            <IconLogo/>
          </a>

          <!-- Nav -->
          <ul class="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
            <li>
              <a href="#" class="nav-link text-secondary">About us</a>
            </li>
            <li>
              <a href="#" class="nav-link text-white">Supports</a>
            </li>
            <li>
              <a href="#" class="nav-link text-white">Knowledge hub</a>
            </li>

            <!-- Buttons -->
            <div class="text-end">
              <button type="button" class="btn btn-warning text-dark me-2">Donate</button>
              <button type="button" class="btn btn-primary">Login</button>
            </div>
          </ul>
        </div>
      </div>
    </div>
</template>

<script setup>
import IconLogo from './icons/IconLogo.vue';

</script>

<style scoped>
.text-small {
  font-size: 85%;
}
</style>