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

          <!-- Modifica della sezione Opening Hours -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Opening Hours (comma-separated, e.g., 9-21, 9-21, 9-21)
            </label>
            <input 
              v-model="openingHoursInput" 
              type="text" 
              placeholder="9-21, 9-21, 9-21" 
              class="input-field" 
            />
          </div>

          <!-- Giorni di apertura -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Opening Days</label>
            <div class="mt-2 flex flex-wrap">
              <div v-for="(day) in daysOfWeek" :key="day.key" class="mr-4">
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="restaurantOpeningDays[day.key]" class="form-checkbox" />
                  <span class="ml-2">{{ day.label }}</span>
                </label>
              </div>
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
        password: { label: 'Password', model: '', type: 'password' },
        confirmPassword: { label: 'Confirm Password', model: '', type: 'password' }
      },
      restaurantFields: {
        restaurantName: { label: 'Restaurant Name', model: '', type: 'text' },
        restaurantAddress: { label: 'Address', model: '', type: 'text' },
        restaurantPhoto: { label: 'Restaurant Photo URL', model: '', type: 'url' }
      },
      restaurantCategories: [],
      categoryInput: '',
      // Ora usiamo solo openingHoursInput per gestire l'input separato da virgole
      openingHoursInput: '',
      errorMessage: '',
      restaurantOpeningDays: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      daysOfWeek: [
        { label: 'Mon', key: 'monday' },
        { label: 'Tue', key: 'tuesday' },
        { label: 'Wed', key: 'wednesday' },
        { label: 'Thu', key: 'thursday' },
        { label: 'Fri', key: 'friday' },
        { label: 'Sat', key: 'saturday' },
        { label: 'Sun', key: 'sunday' }
      ]
    };
  },
  methods: {
    async registerUser() {
      if (this.userFields.password.model !== this.userFields.confirmPassword.model) {
        this.errorMessage = "Passwords do not match";
        return;
      }

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

        // Dividi l'input in base alle virgole e rimuovi spazi indesiderati
        const openingHoursArray = this.openingHoursInput
          .split(',')
          .map(hour => hour.trim())
          .filter(hour => hour !== '');

        const openingDaysArray = [
          this.restaurantOpeningDays.monday ? 1 : 0,
          this.restaurantOpeningDays.tuesday ? 1 : 0,
          this.restaurantOpeningDays.wednesday ? 1 : 0,
          this.restaurantOpeningDays.thursday ? 1 : 0,
          this.restaurantOpeningDays.friday ? 1 : 0,
          this.restaurantOpeningDays.saturday ? 1 : 0,
          this.restaurantOpeningDays.sunday ? 1 : 0
        ];

        await axios.post('http://localhost:8081/api/v1/restaurants', {
          user_id: userId,
          name: this.restaurantFields.restaurantName.model,
          address: this.restaurantFields.restaurantAddress.model,
          categories: this.restaurantCategories,
          opening_hours: openingHoursArray,
          photo: this.restaurantFields.restaurantPhoto.model,
          opening_days: openingDaysArray
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
    }
    // Le funzioni per add/remove opening hours non sono più necessarie
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
