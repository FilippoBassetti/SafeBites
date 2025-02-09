<template>
    <div class="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="ml-6">
          <img src="../assets/safebites_logo.png" alt="Logo" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-red-600">Register as a Restaurant Owner</h2>
      </div>
  
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" @submit.prevent="registerUser">
            <h3 class="text-xl font-semibold">User Information</h3>
            <div v-for="(field, key) in userFields" :key="key">
              <label :for="key" class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
              <input :id="key" v-model="field.model" :type="field.type" required class="input-field" />
            </div>
  
            <h3 class="text-xl font-semibold mt-4">Restaurant Information</h3>
            <div v-for="(field, key) in restaurantFields" :key="key">
              <label :for="key" class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
              <input :id="key" v-model="field.model" :type="field.type" required class="input-field" />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700">Categories</label>
              <input v-model="categoryInput" type="text" class="input-field" @keyup.enter="addCategory" />
              <div class="mt-2 flex flex-wrap">
                <span v-for="(category, index) in restaurantCategories" :key="index" class="category-badge">
                  {{ category }} <button @click.prevent="removeCategory(index)">&times;</button>
                </span>
              </div>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700">Opening Hours (e.g., 9-21)</label>
              <input v-model="openingHoursInput" type="text" class="input-field" @keyup.enter="addOpeningHours" />
              <div class="mt-2 flex flex-wrap">
                <span v-for="(hours, index) in restaurantOpeningHours" :key="index" class="category-badge">
                  {{ hours }} <button @click.prevent="removeOpeningHours(index)">&times;</button>
                </span>
              </div>
            </div>
  
            <button type="submit" class="btn">Register</button>
            <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        userFields: {
          email: { label: 'Email', model: '', type: 'email' },
          firstName: { label: 'First Name', model: '', type: 'text' },
          lastName: { label: 'Last Name', model: '', type: 'text' },
          username: { label: 'Username', model: '', type: 'text' },
          password: { label: 'Password', model: '', type: 'password' }
        },
        restaurantFields: {
          restaurantName: { label: 'Restaurant Name', model: '', type: 'text' },
          restaurantAddress: { label: 'Address', model: '', type: 'text' },
          restaurantPhoto: { label: 'Restaurant Photo URL', model: '', type: 'url' }
        },
        restaurantCategories: [],
        categoryInput: '',
        restaurantOpeningHours: [],
        openingHoursInput: '',
        errorMessage: ''
      };
    },
    methods: {
      async registerUser() {
        try {
          const userResponse = await axios.post('http://localhost:8081/api/v1/users', {
            email: this.userFields.email.model,
            password: this.userFields.password.model,
            user_name: this.userFields.username.model,
            name: this.userFields.firstName.model,
            family_name: this.userFields.lastName.model,
            user_type: true
          });
  
          const userId = userResponse.data.id;
  
          await axios.post('http://localhost:8081/api/v1/restaurants', {
            user_id: userId,
            name: this.restaurantFields.restaurantName.model,
            address: this.restaurantFields.restaurantAddress.model,
            categories: this.restaurantCategories,
            opening_hours: this.restaurantOpeningHours,
            photo: this.restaurantFields.restaurantPhoto.model
          });
  
          alert('Registration successful!');
          this.$router.push('/Home');
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Error during registration';
        }
      },
      addCategory() {
        if (this.categoryInput.trim() && !this.restaurantCategories.includes(this.categoryInput.trim())) {
          this.restaurantCategories.push(this.categoryInput.trim());
          this.categoryInput = '';
        }
      },
      removeCategory(index) {
        this.restaurantCategories.splice(index, 1);
      },
      addOpeningHours() {
        if (this.openingHoursInput.trim()) {
          this.restaurantOpeningHours.push(this.openingHoursInput.trim());
          this.openingHoursInput = '';
        }
      },
      removeOpeningHours(index) {
        this.restaurantOpeningHours.splice(index, 1);
      }
    }
  };
  </script>
  
  <style>
  .input-field {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-top: 4px;
  }
  .btn {
    width: 100%;
    padding: 10px;
    background-color: #ef4444;
    color: white;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
  }
  .category-badge {
    display: inline-block;
    background-color: #f3f4f6;
    padding: 4px 8px;
    margin: 2px;
    border-radius: 10px;
  }
  </style>
  
