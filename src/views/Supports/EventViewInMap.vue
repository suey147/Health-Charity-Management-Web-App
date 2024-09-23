<template>
  <h1 class="text-center">Events</h1>
  <div ref="mapContainerRef" class="map-container"></div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import { onMounted, ref } from 'vue'

mapboxgl.accessToken = 'pk.eyJ1Ijoic3VleWhvIiwiYSI6ImNrbGkyemhlcTRlbjIydnBlN3lvczI5NWsifQ.G9H734iySPGG2ZiJds8kTw';
const mapContainerRef = ref(null);
onMounted(() => {
    const map = new mapboxgl.Map({
        container: mapContainerRef.value,
        style: "mapbox://styles/mapbox/streets-v12", // Replace with your preferred map style
        center: [-71.224518, 42.213995],
        zoom: 9,
  });

})
</script>

<style scoped>
.map-container {
  flex: 1;
  width: 100%;
  height: 400px;
}
</style>
