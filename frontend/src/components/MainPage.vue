<template>
  <div class="p-8">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
        <img src="../assets/safebites_logo.png" class="h-24 w-50" />

        <!-- Centered Searchbar -->
        <div class="relative text-gray-600">
          <input 
            type="search" 
            v-model="searchQuery" 
            placeholder="Search"
            class="bg-white h-12 w-96 mt-5 -ml-52 border-4 px-5 pr-10 rounded-full text-sm focus:outline-none"
          />
          <button type="button" @click="loadRestaurants" class="absolute right-0 top-0 mt-9 mr-4">
            <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.966 56.966">
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>

        <!-- User Icon -->
        <div class="flex items-center space-x-2">
          <img src="../assets/user_icon.png" class="h-14 w-14 mt-4" @click="navigateTo('/userPage')" />
        </div>
      </div>
    </header>

    <!-- Filtra per -->
    <div class="mt-8 mx-auto items-center w-3/5">
      <h2 class="text-lg font-bold mb-4">Filtra per:</h2>
      <div class="flex justify-evenly">
        <div v-for="(value, key) in filters" :key="key" @click="applyFilter(key)" class="flex flex-col items-center cursor-pointer">
          <img :src="filters[key] ? `/img/icon/green/${key}.svg` : `/img/icon/red/${key}.svg`" :alt="key" class="h-12 w-12" />
          <p class="text-sm">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</p>
        </div>
      </div>
    </div>

    <!-- Restaurants List -->
    <div class="flex flex-row h-full">
      <div class="flex flex-wrap justify-evenly mt-8 w-3/5">
        <CardMainPage v-for="(restaurant, index) in restaurants" :key="index" :restaurant="restaurant" />
      </div>
      <div class="bg-zinc-300 mt-12 rounded-xl w-2/5 mr-7 min-h-[800px]">
        <GoogleMap />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import CardMainPage from './CardMainPage.vue';
import { useRouter } from 'vue-router';
import GoogleMap from './GoogleMap.vue';
import axios from 'axios';

const router = useRouter();
const restaurants = ref([]);
const searchQuery = ref("");

const filters = ref({
  vicinanza: false,
  orario: false,
  categoria: false,
  pietanze: false,
  costo: false,
  valutazioni: false,
  preferiti: false,
});

const navigateTo = (route) => {
  router.push(route);
};

const applyFilter = (filterType) => {
  filters.value[filterType] = !filters.value[filterType];
};

const loadRestaurants = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/restaurants', {
      params: {
        search: searchQuery.value ? [searchQuery.value] : [],
        ...filters.value,
      }
    });
    restaurants.value = response.data;
  } catch (error) {
    console.error('Errore nel caricamento dei ristoranti:', error);
  }
};

watch([searchQuery, filters], loadRestaurants, { deep: true });

loadRestaurants();
</script>

