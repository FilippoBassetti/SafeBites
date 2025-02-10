<template>
  <div v-if="center" class="map-container">
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="tileUrl" :attribution="attribution" :maxZoom="19" />
      <l-marker :lat-lng="center"></l-marker>
      <l-marker
        v-for="(coord, index) in restaurantCoords"
        :key="index"
        :lat-lng="coord"
        :icon=redIcon
      />
    </l-map>
  </div>
  <div v-else class="loading">
    Caricamento mappa...
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { LMap, LTileLayer, LMarker } from 'vue3-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { defineProps } from 'vue';

const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76]
});

const props = defineProps({
  restaurants: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const zoom = ref(16);
const center = ref(null);
const restaurantCoords = ref([]);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Get user's current location
onMounted(() => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = [position.coords.latitude, position.coords.longitude];
      },
      (error) => {
        console.error('Error getting location:', error);
        geocodeAddress('Trento, Italy').then((coord) => {
          if (coord) center.value = coord;
        });
      }
    );
  } else {
    geocodeAddress('Trento, Italy').then((coord) => {
      if (coord) center.value = coord;
    });
  }
});

// Geocode restaurant addresses when restaurants change
watch(
  () => props.restaurants,
  async (newRestaurants) => {
    const coords = [];
    for (const restaurant of newRestaurants) {
      const coord = await geocodeAddress(restaurant.address);
      if (coord) coords.push(coord);
    }
    restaurantCoords.value = coords;
  },
  { immediate: true }
);

async function geocodeAddress(addr) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    addr
  )}&format=json&limit=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data?.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    console.error('No results for:', addr);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
</script>

<style scoped>
/* Keep existing styles unchanged */
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 15px;
  overflow: hidden;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}
</style>