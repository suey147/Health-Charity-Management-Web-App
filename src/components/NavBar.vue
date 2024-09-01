<template>
    <div class="px-3 py-2 bg-info text-white">
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
                <button class="btn btn-outline-light me-2 dropdown-toggle" type="button" id="aboutUsDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">
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
                <button class="btn btn-outline-light me-2 dropdown-toggle" type="button" id="supportsDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">
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
              <router-link to="/knowledge-hub" class="btn btn-outline-light me-2" active-class="active">knowledge Hub</router-link>
            </li>

            <!-- Buttons -->
            <div class="text-end d-flex align-items-center">
              <router-link to="/about/donate" class="btn btn-warning text-dark me-2" active-class="active">Donate</router-link>
              <router-link v-if="!$store.getters.isAuthenticated" to="/login" class="btn btn-primary text-dark me-2" active-class="active">Login</router-link>
              <div class="dropdown" v-if="$store.getters.isAuthenticated">
                <a class="me-2 dropdown-toggle" id="userDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">{{user.username}}</a>
                <ul class="dropdown-menu" aria-labelledby="userDropdownButton">
                  <li> <router-link to="/supports/events" class="dropdown-item nav-link" active-class="active">Events</router-link></li>
                  <li><router-link  to="/"  @click="handleLogout" class="btn btn-primary text-dark me-2" active-class="active">Logout</router-link></li>
                </ul>
              </div>
            
            </div>
          </ul>
        </div>
      </div>
    </div>
</template>

<script setup>
  import IconLogo from './icons/IconLogo.vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { computed } from 'vue';
  const store = useStore();
  const router = useRouter();

  const handleLogout = () => {
    store.commit('setAuthenticated', false);
    router.push({ name: 'Home' });
  };

  // automatically update when their dependencies change
  const user = computed(() => {
    return store.getters.userDetails
  })
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