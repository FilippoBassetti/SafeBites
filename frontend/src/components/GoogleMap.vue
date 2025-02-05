<template>
  <div v-if="center" class="map-container">
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="tileUrl" :attribution="attribution" :maxZoom="19" />
      <l-marker :lat-lng="center"></l-marker>
    </l-map>
  </div>
  <div v-else class="loading">
    Caricamento mappa...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { LMap, LTileLayer, LMarker } from 'vue3-leaflet'
import 'leaflet/dist/leaflet.css'

const zoom = ref(16)
const center = ref(null)
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const address = 'Via Venezia, 123, 38122 Trento TN'

async function geocodeAddress(addr) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr)}&format=json&limit=1`
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat)
      const lon = parseFloat(data[0].lon)
      center.value = [lat, lon]
    } else {
      console.error("Nessun risultato trovato per l'indirizzo")
    }
  } catch (error) {
    console.error('Errore durante il geocoding:', error)
  }
}

onMounted(() => {
  geocodeAddress(address)
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 15px; /* Arrotonda gli angoli della mappa */
  overflow: hidden; /* Nasconde le parti fuori dal bordo arrotondato */
}

:host {
  display: block;
  height: 400px;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}
</style>
  