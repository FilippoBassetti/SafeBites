<template>
  <div class="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="ml-6">
        <img src="../assets/safebites_logo.png" alt="Logo" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-agatholight text-gray-900">
        {{ isLogin ? 'SIGN IN TO YOUR ACCOUNT' : 'CREATE NEW ACCOUNT' }}
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Campi extra per la registrazione -->
          <div v-if="!isLogin">
            <label for="family_name" class="block text-sm font-medium text-gray-700 font-agatholightmin">
              Last Name
            </label>
            <div class="mt-1">
              <input id="family_name" v-model="family_name" name="family_name" type="text" autocomplete="family-name"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
          </div>
          <div v-if="!isLogin">
            <label for="name" class="block text-sm font-medium text-gray-700 font-agatholightmin">
              First Name
            </label>
            <div class="mt-1">
              <input id="name" v-model="name" name="name" type="text" autocomplete="given-name" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
          </div>
          <div v-if="!isLogin">
            <label for="user_name" class="block text-sm font-medium text-gray-700 font-agatholightmin">
              Username
            </label>
            <div class="mt-1">
              <input id="user_name" v-model="user_name" name="user_name" type="text" autocomplete="username" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
          </div>
          <!-- Campo Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 font-agatholightmin">
              Email address
            </label>
            <div class="mt-1">
              <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
          </div>
          <!-- Campo Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 font-agatholightmin">
              Password
            </label>
            <div class="mt-1">
              <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
          </div>
          <!-- Campo Confirm Password per la registrazione -->
          <div v-if="!isLogin">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 font-agatholightmin">
              Confirm Password
            </label>
            <div class="mt-1">
              <input id="confirmPassword" v-model="confirmPassword" name="confirmPassword" type="password"
                autocomplete="new-password" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
          </div>
          <!-- Mostra eventuali errori -->
          <div v-if="error" class="text-red-500 text-sm mt-2">
            {{ error }}
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <a href="#" class="font-medium text-red-600 hover:text-red-500 font-agatholightmin">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-agatholightmin text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <button @click="toggleAuthMode" class="font-agatholightmin text-red-600 hover:text-red-500">
            {{ isLogin ? 'Create new account' : 'Already have an account? Sign in' }}
          </button>
        </div>
        <div class="mt-6 text-center">
          <button @click="navigateTo('/RestaurantRegister')" class="font-agatholightmin text-red-600 hover:text-red-500">
            or Register as a restaurant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLogin: true,
      email: '',
      password: '',
      confirmPassword: '',
      user_name: '',
      name: '',
      family_name: '',
      error: ''
    };
  },
  methods: {
    navigateTo(route) {
    this.$router.push(route);
  },
    toggleAuthMode() {
      this.isLogin = !this.isLogin;
      this.error = '';
    },
    async handleSubmit() {
      this.error = '';

      // Controlla i campi richiesti:
      if (!this.email || !this.password || (!this.isLogin && (!this.user_name || !this.name || !this.family_name))) {
        this.error = 'Please fill in all fields';
        return;
      }
      if (!this.validateEmail(this.email)) {
        this.error = 'Please enter a valid email address';
        return;
      }
      if (!this.isLogin && this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }
      if (this.password.length < 6) {
        this.error = 'Password must be at least 6 characters';
        return;
      }

      // Prepara i dati per l'autenticazione
      const authData = {
        email: this.email,
        password: this.password,
        user_name: this.user_name,
        name: this.name,
        family_name: this.family_name,
        user_type: false // Puoi modificare questo valore in base alle necessità
      };

      try {
        let response;
        if (this.isLogin) {
          console.log(authData);
          response = await axios.post('http://localhost:8081/api/v1/authentication', authData);
        } else {
          response = await axios.post('http://localhost:8081/api/v1/users', authData);
        }
        console.log(`${this.isLogin ? 'Login' : 'Registration'} successful:`, response.data);

        // Salva token e dati utente in localStorage

        alert(`${this.isLogin ? 'Login' : 'Registration'} successful!`);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          email: response.data.email,
          user_name: this.user_name,
          name: this.name,
          family_name: this.family_name,
          user_type: response.data.user_type
        }));
        this.$router.push('/Home');
      } catch (error) {
        console.error('Error during authentication:', error.response ? error.response.data.message : error);
        this.error = error.response ? error.response.data.message : 'An error occurred during authentication';
      }
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  },
};
</script>
