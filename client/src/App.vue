<script setup>
  import NavBar from './components/NavBar.vue';
</script>

<template>
  <header>
    <NavBar/>
  </header>

  <main>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 offset-md-2">
              <router-view></router-view>
            </div>
        </div>
    </div>
  </main>
</template>

<style scoped>

</style>
