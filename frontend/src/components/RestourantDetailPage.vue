<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER (rimane invariato) -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
        <img src="../assets/safebites_logo.png" alt="Logo" class="h-24 w-50" @click="navigateTo('/Home')" />

        <!-- SEARCH BAR -->
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

        <!-- USER ICON -->
        <div class="flex items-center space-x-2">
          <img src="../assets/user_icon.png" alt="User" class="h-14 w-14 mt-4" @click="navigateTo('/userPage')" />
        </div>
      </div>
    </header>

    <!-- Immagine e dettagli del ristorante -->
    <div class="relative w-4/6 h-[50vh] flex items-center justify-center mx-auto mt-5">
      <img :src="restaurant.profile_url" alt="Restaurant" class="w-full h-full object-cover rounded-2xl">
      <div class="absolute left-28 top-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-80">
        <button @click="toggleFavorite" class="absolute top-2 right-2">
          <svg v-if="isFavorite" class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.75l-6.518 3.738 1.244-7.26L2 9.51l7.289-1.06L12 2.5l2.711 5.95L22 9.51l-4.726 4.717 1.244 7.26z" />
          </svg>
          <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
        <h2 class="text-3xl font-bold text-gray-800">{{ restaurant.name }}</h2>
        <p class="text-gray-600">{{ restaurant.address }}</p>
        <p class="text-gray-600">Category: {{ restaurant.category }}</p>
        <p class="text-gray-600">Price: {{ restaurant.price }}</p>
        <p class="text-gray-600">Status: {{ isOpen ? 'Open' : 'Closed' }}</p>
        <p class="text-gray-600">Rating: {{ restaurant.rating }} ⭐</p>
      </div>
    </div>

    <!-- Sezione MENU -->
    <section class="max-w-7xl mx-auto mt-10">
      <h2 class="text-2xl font-bold text-red-700 mb-4">MENU:</h2>
      <div class="grid grid-cols-5 gap-4">
        <!-- Uso del componente MenuCard per ogni piatto -->
        <MenuCard 
          v-for="dish in restaurant.dishes" 
          :key="dish.name" 
          :dish="dish" 
        />
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import MenuCard from './MenuCard.vue';

export default {
  name: 'RestaurantDetailPage',
  components: {
    MenuCard
  },
  data() {
    return {
      searchQuery: '',
      restaurant: {
        profile_url: '',
        name: '',
        address: '',
        category: '',
        price: '',
        opening_hours: '',
        opening_days: [],
        rating: '',
        dishes: []  // Assicurati che questo campo sia un array di oggetti
      },
      isOpen: false,
      isFavorite: false
    };
  },
  created() {
    this.fetchRestaurantData();
  },
  methods: {
    async fetchRestaurantData() {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/restaurants/${this.$route.params.id}`);
        this.restaurant = response.data;
        this.checkOpenStatus();
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    },
    checkOpenStatus() {
      const now = new Date();
      const currentDay = now.toLocaleString('en-US', { weekday: 'long' });
      const currentHour = now.getHours();
      this.isOpen = this.restaurant.opening_days.includes(currentDay) &&
                    this.restaurant.opening_hours.includes(currentHour);
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      // Puoi aggiungere qui una chiamata API per aggiornare i preferiti dell'utente
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    loadRestaurants() {
      // Implementa la logica per il caricamento dei ristoranti, se non lo hai già fatto
    }
  }
};
</script>
