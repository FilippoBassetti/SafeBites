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
    @click="handleChangeName"
    class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors"
  >
    Change Name/Surname
  </button>
  <div v-if="showNameFields" class="mt-2">
    <input
      v-model="newName"
      type="text"
      placeholder="New Name"
      class="w-full px-3 py-2 border rounded-lg mb-2"
    />
    <input
      v-model="newSurname"
      type="text"
      placeholder="New Surname"
      class="w-full px-3 py-2 border rounded-lg mb-2"
    />
    <button
      @click="handleConfirmName"
      class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors"
    >
      Confirm Name
    </button>
  </div>

  <!-- Change Username -->
  <button
    @click="handleChangeUsername"
    class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mt-2"
  >
    Change Username
  </button>
  <div v-if="showUsernameField" class="mt-2">
    <input
      v-model="newUsername"
      type="text"
      placeholder="New Username"
      class="w-full px-3 py-2 border rounded-lg mb-2"
    />
    <button
      @click="handleConfirmUsername"
      class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors"
    >
      Confirm Username
    </button>
  </div>
        <button
          @click="handleChangeEmail"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mb-2 mt-2"
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
          class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors "
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
        <div class="mt-6">
    <button
      type="submit"
      class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
    >
      Save Restaurant Changes
    </button>
  </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  
  const navigateTo = (routePath) => {
    router.push(routePath);
  };
  const user = JSON.parse(localStorage.getItem('user'));
  // User info data
  var Name = user.name;
  var userName = user.username;
  var userSurname = user.family_name;
  const userEmail = user.email;
  const showEmailField = ref(false);
  const newEmail = ref('');
  const showPasswordFields = ref(false);
  const newPassword = ref('');
  const confirmPassword = ref('');
  const passwordError = ref('');
  const showNameFields = ref(false);
  const userId = user.id;
const newName = ref('');
const newSurname = ref('');
const showUsernameField = ref(false);
const newUsername = ref('');
  
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
  try {
    await axios.put(
      `https://safebites.onrender.com/api/v1/users/${user.id}`,
      {
        email: newEmail.value,
        token: localStorage.getItem('token')
      }
    );
    
    // Update local storage and UI
    const updatedUser = { ...user, email: newEmail.value };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    userEmail.value = newEmail.value;
    showEmailField.value = false;
  } catch (error) {
    console.error('Error updating email:', error);
  }
};
  
  const handleChangePassword = () => {
    showPasswordFields.value = !showPasswordFields.value;
  };

  const handleChangeName = () => {
  showNameFields.value = !showNameFields.value;
  newName.value = Name;
  newSurname.value = userSurname;
};

const handleConfirmName = async () => {
  try {
    const response = await axios.put(
      `https://safebites.onrender.com/api/v1/users/${user.id}`,
      {
        name: newName.value,
        family_name: newSurname.value,
        token: localStorage.getItem('token')
      }
    );
    console.log(response);
    // Update local storage and UI
    const updatedUser = { ...user, name: newName.value, family_name: newSurname.value };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    Name = newName.value;
    userSurname = newSurname.value;
    showNameFields.value = false;
  } catch (error) {
    console.error('Error updating name:', error);
  }
};
const handleChangeUsername = () => {
  showUsernameField.value = !showUsernameField.value;
  newUsername.value = userName;
};

const handleConfirmUsername = async () => {
  try {
    const response = await axios.put(
      `https://safebites.onrender.com/api/v1/users/${user.id}`,
      {
        user_name: newUsername.value,
        token: localStorage.getItem('token')
      }
    );
    console.log(response);
    // Update local storage and UI
    const updatedUser = { ...user, username: newUsername.value };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    userName = newUsername.value;
    showUsernameField.value = false;
  } catch (error) {
    console.error('Error updating username:', error);
  }
};
  
const handleConfirmPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match';
    return;
  }
  try {
    await axios.put(
      `https://safebites.onrender.com/api/v1/users/${user.id}`,
      {
        password: newPassword.value,
        token: localStorage.getItem('token')
      }
    );
    showPasswordFields.value = false;
    passwordError.value = '';
  } catch (error) {
    console.error('Error updating password:', error);
  }
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
  
  onMounted(async () => {
    try {
      console.log(userId);
      // Recupera i dati del ristorante tramite l'endpoint by-user
      const response = await axios.get(`https://safebites.onrender.com/api/v1/resturants/by-user/${userId}`, {
        token: localStorage.getItem('token')
      });
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
    await axios.put(
      `https://safebites.onrender.com/api/v1/restaurants/${restaurant.value.id}`,
      {
        ...restaurant.value,
        token: localStorage.getItem('token')
      }
    );
    message.value = 'Ristorante aggiornato con successo!';
    setTimeout(() => message.value = '', 3000);
  } catch (error) {
    console.error("Errore durante l'aggiornamento:", error);
    message.value = "Errore durante l'aggiornamento";
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
      const res = await axios.get(`https://safebites.onrender.com/api/v1/reviews/${restaurant.value.id}`);
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
  