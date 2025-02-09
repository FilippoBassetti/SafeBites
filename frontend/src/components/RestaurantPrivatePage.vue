<template>
     <!-- HEADER (rimane invariato) -->
     <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
        <img
          src="../assets/safebites_logo.png"
          alt="Logo"
          class="h-24 w-50"
          @click="navigateTo('/Home')"
        />

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
          <img
            src="../assets/user_icon.png"
            alt="User"
            class="h-14 w-14 mt-4"
            @click="navigateTo('/userPage')"
          />
        </div>
      </div>
    </header>
    <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <!-- User Info Panel -->
      <div class="bg-white p-6 rounded-xl shadow-lg w-96 text-center mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-4">INFO</h2>
        <p class="text-sm text-gray-600">
          <span class="font-semibold">Name:</span> {{ Name }} {{ userSurname }}
        </p>
        <p class="text-sm text-gray-600">
          <span class="font-semibold">Username:</span> {{ userName }}
        </p>
        <p class="text-sm text-gray-600 mb-4">
          <span class="font-semibold">Email:</span> {{ userEmail }}
        </p>
    
        <button
          @click="handleChangeEmail"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mb-2"
        >
          Change Email
        </button>
        <div v-if="showEmailField" class="mt-2">
          <input
            v-model="newEmail"
            type="email"
            placeholder="New Email"
            class="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <button
            @click="handleConfirmEmail"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors"
          >
            Confirm Email
          </button>
        </div>
    
        <button
          @click="handleChangePassword"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mt-2"
        >
          Change Password
        </button>
        <div v-if="showPasswordFields" class="mt-2">
          <input
            v-model="newPassword"
            type="password"
            placeholder="New Password"
            class="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
          <button
            @click="handleConfirmPassword"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors"
          >
            Confirm Password
          </button>
        </div>
      </div>
    
      <!-- Modify Restaurant Button -->
      <button
        @click="toggleModifyForm"
        class="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg mb-8"
      >
        {{ showModifyForm ? 'Hide Restaurant Form' : 'Modify Restaurant Data' }}
      </button>
    
      <!-- Restaurant Form (Conditional) -->
      <div v-if="showModifyForm" class="min-h-screen bg-gray-50 flex flex-col items-center p-6 w-1/3">
        <div class="bg-white p-6 rounded-xl shadow-lg w-full">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            Modifica il tuo Ristorante
          </h2>
          <form @submit.prevent="updateRestaurant" class="space-y-6">
            <!-- Campi del ristorante -->
            <div>
              <label for="name" class="block text-lg font-medium text-gray-700">Nome</label>
              <input
                type="text"
                id="name"
                v-model="restaurant.name"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div>
              <label for="address" class="block text-lg font-medium text-gray-700">Indirizzo</label>
              <input
                type="text"
                id="address"
                v-model="restaurant.address"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div>
              <label for="category" class="block text-lg font-medium text-gray-700">Categoria</label>
              <input
                type="text"
                id="category"
                v-model="restaurant.category"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div>
              <label for="price" class="block text-lg font-medium text-gray-700">Prezzo</label>
              <select
                id="price"
                v-model="restaurant.price"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              >
                <option disabled value="">Seleziona un'opzione</option>
                <option value="0-10">0-10</option>
                <option value="10-20">10-20</option>
                <option value="20-40">20-40</option>
                <option value="40-60">40-60</option>
                <option value="60-100">60-100</option>
                <option value="100+">100+</option>
              </select>
            </div>
            <div>
              <label for="profile_url" class="block text-lg font-medium text-gray-700">URL Foto</label>
              <input
                type="url"
                id="profile_url"
                v-model="restaurant.profile_url"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
    
            <!-- Dishes Section -->
            <div>
              <h3 class="text-xl font-semibold text-gray-700 mb-4">Piatti</h3>
              <!-- Lista dei piatti -->
              <div
                v-for="(dish, index) in restaurant.dishes"
                :key="index"
                class="p-4 border border-gray-300 rounded-md mb-4"
              >
                <!-- Modalità modifica: input per nome e URL, pulsante Salva -->
                <div v-if="dish.editing">
                  <div class="mb-2">
                    <label :for="'dish-name-' + index" class="block text-lg font-medium text-gray-700">Nome Piatto</label>
                    <input
                      type="text"
                      :id="'dish-name-' + index"
                      v-model="dish.name"
                      required
                      class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                  </div>
                  <div class="mb-2">
                    <label :for="'dish-photo-' + index" class="block text-lg font-medium text-gray-700">URL Foto Piatto</label>
                    <input
                      type="url"
                      :id="'dish-photo-' + index"
                      v-model="dish.photo_url"
                      required
                      class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                  </div>
                  <div class="flex space-x-2">
                    <button
                      type="button"
                      @click="saveDish(index)"
                      class="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Salva
                    </button>
                    <button
                      type="button"
                      @click="removeDish(index)"
                      class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
                <!-- Modalità visualizzazione: mostra nome e URL come testo con pulsanti per modificare o rimuovere -->
                <div v-else>
                  <p class="text-lg font-medium text-gray-700">Nome: {{ dish.name }}</p>
                  <p class="text-gray-600">
                    Foto:
                    <a :href="dish.photo_url" target="_blank" class="text-blue-500 hover:underline">
                      {{ dish.photo_url }}
                    </a>
                  </p>
                  <div class="flex space-x-2 mt-2">
                    <button
                      type="button"
                      @click="editDish(index)"
                      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Modifica
                    </button>
                    <button
                      type="button"
                      @click="removeDish(index)"
                      class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              </div>
              <!-- Pulsante per aggiungere un nuovo piatto -->
              <button
                type="button"
                @click="addDish"
                class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                Aggiungi Piatto
              </button>
            </div>
          </form>
          <div v-if="message" class="mt-4 text-green-600 font-semibold text-center text-sm">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const route = useRoute();
  
  const navigateTo = (routePath) => {
    router.push(routePath);
  };
  const user = JSON.parse(localStorage.getItem('user'));
  // User info data
  const Name = user.name;
  const userName = user.username;
  const userSurname = user.family_name;
  const userEmail = user.email;
  const showEmailField = ref(false);
  const newEmail = ref('');
  const showPasswordFields = ref(false);
  const newPassword = ref('');
  const confirmPassword = ref('');
  const passwordError = ref('');
  
  // Restaurant form visibility
  const showModifyForm = ref(false);
  const toggleModifyForm = () => {
    showModifyForm.value = !showModifyForm.value;
  };
  
  // Email/password methods
  const handleChangeEmail = () => {
    showEmailField.value = !showEmailField.value;
  };
  
  const handleConfirmEmail = async () => {
    // Implement email update logic
  };
  
  const handleChangePassword = () => {
    showPasswordFields.value = !showPasswordFields.value;
  };
  
  const handleConfirmPassword = () => {
    if (newPassword.value !== confirmPassword.value) {
      passwordError.value = 'Passwords do not match';
      return;
    }
    // Implement password update logic
  };
  
  // Inizializzazione dell'oggetto restaurant
  const restaurant = ref({
    user_id: '',
    email: '',
    name: '',
    address: '',
    category: '',
    price: '',
    opening_hours: [],
    opening_days: {},
    profile_url: '',
    certificate: false,
    dishes: []
  });
  
  const message = ref('');
  const reviews = ref([]);
  
  const userId = route.params.userId;
  
  onMounted(async () => {
    try {
      // Recupera i dati del ristorante tramite l'endpoint by-user
      const response = await axios.get(`http://localhost:8081/api/v1/resturants/by-user/${userId}`);
      restaurant.value = response.data;
      if (!restaurant.value.dishes) {
        restaurant.value.dishes = [];
      } else {
        restaurant.value.dishes = restaurant.value.dishes.map((dish) => ({
          ...dish,
          editing: false
        }));
      }
      // Dopo aver ottenuto i dati del ristorante, carica le recensioni
      await fetchReviews();
    } catch (error) {
      console.error('Errore nel recupero dei dati del ristorante:', error);
    }
  });
  
  const updateRestaurant = async () => {
    try {
      await axios.put(`http://localhost:8081/api/v1/restaurants/${restaurant.value.id}`, restaurant.value);
      message.value = 'Ristorante aggiornato con successo!';
    } catch (error) {
      console.error("Errore durante l'aggiornamento del ristorante:", error);
      message.value = "Si è verificato un errore durante l'aggiornamento.";
    }
  };
  
  const addDish = () => {
    restaurant.value.dishes.push({
      name: '',
      photo_url: '',
      editing: true
    });
  };
  
  const removeDish = (index) => {
    restaurant.value.dishes.splice(index, 1);
  };
  
  const editDish = (index) => {
    restaurant.value.dishes[index].editing = true;
  };
  
  const saveDish = (index) => {
    restaurant.value.dishes[index].editing = false;
  };
  
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/v1/reviews/${restaurant.value.id}`);
      // Il backend restituisce { reviews: [...] }
      reviews.value = res.data.reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      reviews.value = [];
    }
  };

  </script>
  
  <style scoped>
  /* Aggiungi eventuali stili personalizzati qui */
  </style>
  