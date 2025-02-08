<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
        <img src="../assets/safebites_logo.png" class="h-24 w-50">
        <div class="relative text-gray-600">
          <input type="search" placeholder="Search" class="bg-white h-12 w-96 mt-5 -ml-52 border-4 px-5 pr-10 rounded-full text-sm focus:outline-none">
        </div>
        <div class="flex items-center space-x-2">
          <img src="../assets/user_icon.png" class="h-14 w-14 mt-4">
        </div>
      </div>
    </header>

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
        <p class="text-gray-600">Price: {{ formatPrice(restaurant.price) }}</p>
        <p class="text-gray-600">Status: {{ isOpen ? 'Open' : 'Closed' }}</p>
        <p class="text-gray-600">Rating: {{ restaurant.rating }} ⭐</p>
      </div>
    </div>

    <section class="max-w-7xl mx-auto mt-10">
      <h2 class="text-2xl font-bold text-red-700 mb-4">MENU:</h2>
      <div class="grid grid-cols-5 gap-4">
        <div v-for="dish in restaurant.dishes" :key="dish.name" class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <img :src="dish.image_url" :alt="dish.name" class="w-32 h-32 object-cover rounded-lg">
          <p class="text-green-700 font-semibold mt-2">{{ dish.name }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RestaurantDetailPage',
  data() {
    return {
      restaurant: {
        profile_url: '',
        name: '',
        address: '',
        category: '',
        price: '',
        opening_hours: '',
        opening_days: [],
        rating: '',
        dishes: []
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
        const response = await axios.get(`http://localhost:8000/api/v1/restaurants/${this.$route.params.id}`);
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
    formatPrice(price) {
      return '$'.repeat(price) || 'Unknown';
    },

    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
        // Qui puoi anche fare una richiesta API per aggiornare i preferiti dell'utente
      }
  }
};
</script>

<style scoped>
</style>
