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
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="aboutUsDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">
                  About us
                </button>
                <ul class="dropdown-menu" aria-labelledby="aboutUsDropdownButton">
                  <li><router-link to="/about/about-us" class="dropdown-item nav-link" active-class="active">About us</router-link></li>
                  <li><router-link to="/about/contact-us" class="dropdown-item nav-link" active-class="active">Contact us</router-link></li>
                  <li><router-link to="/about/team" class="dropdown-item nav-link" active-class="active">Our Team</router-link></li>
                  <li> <router-link to="/about/donate" class="dropdown-item nav-link" active-class="active">Donate</router-link></li>
                </ul>
              </div>
            </li>
            <li>
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="supportsDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">
                  Supports
                </button>
                <ul class="dropdown-menu" aria-labelledby="supportsDropdownButton">
                  <li> <router-link to="/supports/events" class="dropdown-item nav-link" active-class="active">Events</router-link></li>
                  <li> <router-link to="/supports/forum" class="dropdown-item nav-link" active-class="active">Forums</router-link></li>
                  <li>
                    <router-link to="/supports/support-groups" class="dropdown-item nav-link" active-class="active">Support Groups</router-link>
                  </li>
                  
                </ul>
              </div>
            </li>
            <li>
              <button class="btn btn-secondary" type="button">
                  Knowledge Hub
              </button>
            </li>

            <!-- Buttons -->
            <div class="text-end">
              <button type="button" class="btn btn-warning text-dark me-2" href="/about/donate">Donate</button>
              <button type="button" class="btn btn-primary" href="/">Login</button>
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

.dropdown:hover>.dropdown-menu {
  display: block;
}

.dropdown>.dropdown-toggle:active {
  pointer-events: none;
}
</style>