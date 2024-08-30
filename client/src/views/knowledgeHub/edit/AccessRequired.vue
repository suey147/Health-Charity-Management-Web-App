<template>
  <h1 class="text-center">Knowledge Hub</h1>
  <p>Access to the Knowledgehub is currently restricted to members only. If you are interested in accessing the Knowledgehub please
    <router-link to="/register" class="text-black me-2" active-class="active">Register</router-link>
    <router-link :to="{ path: '/login', query: { redirect: $route.query.redirect || '/knowledge-hub' } }"
                class="text-black me-2" active-class="active">Login</router-link>
  </p>

</template>

<script setup>
</script>
