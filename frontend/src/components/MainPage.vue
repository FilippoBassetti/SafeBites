<template>
  <div class="p-8">
    <!-- Header -->
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
            <img src="../assets/safebites_logo.png" class="h-24 w-50">

            <!-- Centered Searchbar -->
            <div class="relative text-gray-600">
                <input type="search" name="search" placeholder="Search"
                    class="bg-white h-12 w-96 mt-5 -ml-52 border-4 px-5 pr-10 rounded-full text-sm focus:outline-none">
                <button type="submit" class="absolute right-0 top-0 mt-9 mr-4">
                    <!-- Search Icon -->
                    <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.966 56.966">
                        <path
                            d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                    </svg>
                </button>
            </div>

            <!-- User Icon -->
            <div class="flex items-center space-x-2">
                <img src="../assets/user_icon.png" class="h-14 w-14 mt-4" @click="navigateTo('/userPage')">
            </div>
        </div>
    </header>

    <!-- Filtra per -->
    <div class="mt-8 mx-auto items-center w-3/5">
    <h2 class="text-lg font-bold mb-4">Filtra per:</h2>
    <div class="flex justify-evenly">
      <div @click="applyFilter('vicinanza')" class="flex flex-col items-center cursor-pointer">
        <img :src="filters.vicinanza ? '/img/icon/green/position.svg' : '/img/icon/red/position.svg'" alt="Vicinanza" class="h-12 w-12">
        <p class="text-sm">Vicinanza</p>
      </div>
      <div @click="applyFilter('orario')" class="flex flex-col items-center cursor-pointer">
        <img :src="filters.orario ? '/img/icon/green/time.svg' : '/img/icon/red/time.svg'" alt="Orario" class="h-12 w-12">
        <p class="text-sm">Orario</p>
      </div>
      <div @click="applyFilter('categoria')" class="flex flex-col items-center cursor-pointer">
        <img :src="filters.categoria ? '/img/icon/green/type.svg' : '/img/icon/red/type.svg'" alt="Categoria" class="h-12 w-12">
        <p class="text-sm">Categoria</p>
      </div>
      <div @click="applyFilter('pietanze')" class="flex flex-col items-center cursor-pointer">
        <img :src="filters.pietanze ? '/img/icon/green/dishes.svg' : '/img/icon/red/dishes.svg'" alt="Pietanze" class="h-12 w-12">
        <p class="text-sm">Pietanze</p>
      </div>
      <div @click="applyFilter('costo')" class="flex flex-col items-center cursor-pointer">
        <img :src="filters.costo ? '/img/icon/green/price.svg' : '/img/icon/red/price.svg'" alt="Costo" class="h-12 w-12">
        <p class="text-sm">Costo</p>
      </div>
      <div @click="applyFilter('valutazioni')" class="flex flex-col items-center cursor-pointer">
        <img :src="filters.valutazioni ? '/img/icon/green/rank.svg' : '/img/icon/red/rank.svg'" alt="Valutazioni" class="h-12 w-12">
        <p class="text-sm">Valutazioni</p>
      </div>
      <div @click="applyFilter('preferiti')" class="flex flex-col items-center cursor-pointer">
        <img :src="filters.preferiti ? '/img/icon/green/saved.svg' : '/img/icon/red/saved.svg'" alt="Preferiti" class="h-12 w-12">
        <p class="text-sm">Preferiti</p>
      </div>
    </div>
  </div>

    <!-- Restaurants List -->
    <div class="flex flex-row h-full">
  <div class="flex flex-wrap justify-evenly mt-8 w-3/5">
    <CardMainPage v-for="(restaurant, index) in restaurants" :key="index" />
  </div>
  <div class="bg-zinc-300 mt-12 rounded-xl w-2/5 mr-7 min-h-[800px]">  <!-- Aumentato l'altezza minima -->
    <GoogleMap />
  </div>
</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CardMainPage from './CardMainPage.vue';
import { useRouter } from 'vue-router';
import GoogleMap from './GoogleMap.vue';
import axios from 'axios';

const router = useRouter();
const restaurants = ref([]);  // Array per memorizzare i ristoranti
const filters = ref({
  vicinanza: false,
  orario: false,
  categoria: false,
  pietanze: false,
  costo: false,
  valutazioni: false,
  preferiti: false
});

const navigateTo = (route) => {
  router.push(route);
};

const applyFilter = async (filterType) => {
  // Modifica lo stato del filtro
  filters.value[filterType] = !filters.value[filterType];

  // Filtra i ristoranti in base ai filtri selezionati
  try {
    const response = await axios.get('http://localhost:8000/api/v1/restaurants', {
      params: {
        vicinanza: filters.value.vicinanza,
        orario: filters.value.orario,
        categoria: filters.value.categoria,
        pietanze: filters.value.pietanze,
        costo: filters.value.costo,
        valutazioni: filters.value.valutazioni,
        preferiti: filters.value.preferiti
      }
    });
    restaurants.value = response.data;  // Aggiorna la lista dei ristoranti
  } catch (error) {
    console.error('Error applying filter:', error);
  }
};

const loadRestaurants = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/restaurants');
    restaurants.value = response.data;
  } catch (error) {
    console.error('Error loading restaurants:', error);
  }
};

loadRestaurants();  // Carica i ristoranti quando il componente viene montato
</script>
