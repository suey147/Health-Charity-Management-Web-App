<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <header>
    <NavBar />
  </header>

  <main>
    <router-view></router-view>
  </main>
</template>

<style scoped></style>
