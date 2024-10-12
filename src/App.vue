<script setup>
import NavBar from './components/NavBar.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()
const skipLink = ref()

watch(
  () => route.path,
  () => {
    skipLink.value.focus()
  }
)
</script>

<template>
  <ul class="skip-link">
    <li>
      <a href="#main" ref="skipLink" class="skip-link">Skip to main content</a>
    </li>
  </ul>

  <header>
    
  </header>
  <nav>
    <NavBar />
  </nav>

  <main>
    <router-view></router-view>
  </main>
</template>

<style scoped>
.skip-link {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
}
</style>
