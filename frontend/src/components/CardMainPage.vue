<template>
    <div class="h-[26rem] w-[20rem] ml-2 bg-pink-50 rounded-xl justify-center align-middle flex flex-col p-4 mt-4 shadow-lg">
      <!-- Immagine del ristorante -->
      <div>
        <img :src="restaurant.profile_url" alt="Restaurant Image" class="w-full h-[12rem] object-cover rounded-lg">
      </div>
      <div class="mt-4">
        <!-- Nome del ristorante -->
        <h2 class="text-lg font-bold">{{ restaurant.name }}</h2>
        <!-- Indirizzo del ristorante -->
        <p class="text-sm text-gray-600">{{ restaurant.address }}</p>
        <!-- Categoria del ristorante -->
        <p class="text-sm text-gray-600">Category: {{ restaurant.category }}</p>
        <!-- Fascia di prezzo -->
        <p class="text-sm text-gray-600">Price: {{ formatPrice(restaurant.price) }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'CardMainPage',
    data() {
      return {
        restaurant: {
          profile_url: '',
          name: '',
          address: '',
          category: '',
          price: ''
        }
      };
    },
    created() {
      this.fetchRestaurantData();
    },
    methods: {
      async fetchRestaurantData() {
        try {
          const userId = '123'; // O usa un parametro dinamico come this.$route.params.userId se necessario
          const response = await axios.get(`http://localhost:8000/api/v1/restaurants/by-user/${userId}`);
          this.restaurant = response.data;
        } catch (error) {
          console.error('Error fetching restaurant data:', error);
        }
      },
      formatPrice(price) {
        switch(price) {
          case 1: return '$'; 
          case 2: return '$$'; 
          case 3: return '$$$'; 
          case 4: return '$$$$'; 
          default: return 'Unknown';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Aggiungi qui stili personalizzati se necessario */
  </style>
  