<template>
    <div class="min-h-screen bg-white flex flex-col items-center p-6">
      <!-- HEADER -->
      <header class="bg-white shadow-sm w-full">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
          <img
            src="../assets/safebites_logo.png"
            alt="Logo"
            class="h-24 w-50 cursor-pointer"
            @click="navigateTo('/Home')"
          />
  
          <!-- Centered Searchbar -->
          <div class="relative text-gray-600">
            <input
              type="search"
              name="search"
              placeholder="Search"
              class="bg-white h-12 w-96 mt-5 -ml-52 border-4 px-5 pr-10 rounded-full text-sm focus:outline-none"
            />
            <button type="submit" @click="loadRestaurants" class="absolute right-0 top-0 mt-9 mr-4">
              <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.966 56.966">
                <path
                  d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
                />
              </svg>
            </button>
          </div>
  
          <!-- User Icon e bottoni Logout / Delete Profile -->
          <div class="flex items-center space-x-2">
            <img
              src="../assets/user_icon.png"
              alt="User Icon"
              class="h-14 w-14 mt-4 cursor-pointer"
              @click="navigateTo('/userPage')"
            />
            
          </div>
        </div>
      </header>
      <div class="self-end mt-8"> 
        <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
              Logout
            </button>
            <button @click="deleteProfile" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">
              Delete Profile
            </button>
        </div>
      <!-- User Info Section -->
      <div class="bg-white p-6 rounded-xl shadow-lg w-96 text-center mb-8 mt-8">
        <h2 class="text-xl font-bold text-gray-800 mb-4 font-agatholight">INFO</h2>
        <p class="text-sm text-gray-600">
          <span class="font-semibold">Name:</span> {{ Name }} {{ userSurname }}
        </p>
        <p class="text-sm text-gray-600">
          <span class="font-semibold">Username:</span> {{ userName }}
        </p>
        <p class="text-sm text-gray-600 mb-4">
          <span class="font-semibold">Email:</span> {{ userEmail }}
        </p>
  
        <button @click="handleChangeEmail" class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mb-2">
          Change Email
        </button>
        <div v-if="showEmailField" class="mt-2">
          <input
            v-model="newEmail"
            type="email"
            placeholder="New Email"
            class="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <button @click="handleConfirmEmail" class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors">
            Confirm Email
          </button>
        </div>
  
        <button @click="handleChangePassword" class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mt-2">
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
          <button @click="handleConfirmPassword" class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors">
            Confirm Password
          </button>
        </div>
      </div>
  
      <!-- Favorites Section -->
      <section class="w-full max-w-4xl text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4 font-agatholight">FAVOURITES</h2>
        <div class="flex flex-col items-center gap-4">
          <div v-for="restaurantItem in favoriteRestaurants" :key="restaurantItem.id" class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow w-96">
            <h3 class="text-lg font-medium text-gray-700">{{ restaurantItem.name }}</h3>
          </div>
        </div>
      </section>
    
    </div>
  </template>
  
  <script setup>
  import { ref} from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  
  // Navigazione
  const navigateTo = (routePath) => {
    router.push(routePath);
  };

  const defaultUser = {
  email: "example@email.com",
  password: "hashedpassword123",
  user_name: "exampleUser",
  name: "John",
  family_name: "Doe",
  favourite_list: ["Restaurant A", "Restaurant B"],
  user_type: true,
};
  
  // Estrai dati utente dal localStorage
  const user = JSON.parse(localStorage.getItem('user')) || defaultUser;
  const userName = ref(user.user_name);
  const Name = ref(user.name);
  const userSurname = ref(user.family_name);
  const userEmail = ref(user.email);
  const favoriteRestaurants = ref(user.favourite_list || []);
  
  // Variabili per gestione email e password
  const showEmailField = ref(false);
  const newEmail = ref('');
  const showPasswordFields = ref(false);
  const newPassword = ref('');
  const confirmPassword = ref('');
  const passwordError = ref('');
  
  // Funzioni per email e password
  const handleChangeEmail = () => {
    showEmailField.value = !showEmailField.value;
  };
  
  const handleConfirmEmail = async () => {
    try {
      const response = await axios.put(`http://localhost:8081/api/v1/users/${user.id}`, {
        email: newEmail.value,
        user_name: userName.value,
        name: Name.value,
        family_name: userSurname.value
        // Non aggiorniamo la password se non è stata richiesta
      });
      console.log(response);
      userEmail.value = newEmail.value;
      alert('Email updated successfully!');
      showEmailField.value = false;
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Error updating email.');
    }
  };
  
  
  const handleChangePassword = () => {
    showPasswordFields.value = !showPasswordFields.value;
  };
  
  const handleConfirmPassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
      passwordError.value = 'Passwords do not match!';
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8081/api/v1/users/${user.id}`, {
        email: userEmail.value,
        user_name: userName.value,
        name: Name.value,
        family_name: userSurname.value,
        password: newPassword.value
      });
      console.log(response);
      alert('Password updated successfully!');
      showPasswordFields.value = false;
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password.');
    }
  };
  
  // Funzioni per Logout e Delete Profile
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/Home');
  };
  
  const deleteProfile = async () => {
    if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8081/api/v1/users/${user.id}`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/Home');
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Error deleting profile.');
    }
  };
  
  // Variabili per la modifica del ristorante
  </script>
  
  <style scoped>
    /* Aggiungi eventuali stili personalizzati qui */
  </style>
  