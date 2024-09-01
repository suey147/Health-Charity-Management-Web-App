<template>
    <div class="container-fluid p-3 p-md-5 text-white bg-secondary">
        <div class="col-md-6 px-0">
          <h1 class="display-4 font-italic">MindWell</h1>
          <p class="lead my-3">This a website for charity that focus on individual with mental health challenges.</p>
          <router-link v-if="!$store.getters.isAuthenticated" to="/register" class="btn btn-primary text-light me-2" active-class="active">Register</router-link>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>


</style>