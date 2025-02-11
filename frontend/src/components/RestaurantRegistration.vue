<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center mb-4">
        <img src="../assets/safebites_logo.png" alt="Logo" class="h-12" @click="navigateTo('/Home')"/>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-red-600">
        Register as a Restaurant Owner
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="registerUser">
          <!-- User Information Section -->
          <div>
            <h3 class="text-xl font-semibold text-gray-700 mb-4">User Information</h3>
            <div v-for="(field, key) in userFields" :key="key" class="mb-4">
              <label :for="key" class="block text-sm font-medium text-gray-700">
                {{ field.label }}
              </label>
              <input
                :id="key"
                v-model="field.model"
                :type="field.type"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-1 text-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <!-- Restaurant Information Section -->
          <div>
            <h3 class="text-xl font-semibold text-gray-700 mb-4">Restaurant Information</h3>
            <div v-for="(field, key) in restaurantFields" :key="key" class="mb-4">
              <label :for="key" class="block text-sm font-medium text-gray-700">
                {{ field.label }}
              </label>
              <input
                :id="key"
                v-model="field.model"
                :type="field.type"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-1 text-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <!-- Categories Multi-Select Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categories</label>
            <div class="relative">
              <div
                class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1 text-lg bg-white cursor-pointer"
                @click="toggleCategoriesDropdown"
              >
                <span v-if="restaurantCategories.length === 0" class="text-gray-400">
                  Select categories
                </span>
                <span v-else class="text-gray-800">
                  {{ restaurantCategories.join(', ') }}
                </span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </span>
              </div>
              <div
                v-if="showCategoriesDropdown"
                class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto"
              >
                <div
                  v-for="(cat, index) in categoriesOptions"
                  :key="index"
                  class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :id="'cat-' + index"
                    :value="cat"
                    v-model="restaurantCategories"
                    class="form-checkbox text-indigo-600 mr-2"
                    @click.stop
                  />
                  <label :for="'cat-' + index" class="select-none text-gray-700">
                    {{ cat }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Cost Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cost</label>
            <select
              v-model="selectedCost"
              class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-1 text-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option disabled value=""></option>
              <option
                v-for="(option, index) in costOptions"
                :key="index"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Dishes Offered Multi-Select Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dishes Offered</label>
            <div class="relative">
              <div
                class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1 text-lg bg-white cursor-pointer"
                @click="toggleDishesDropdown"
              >
                <span v-if="restaurantDishes.length === 0" class="text-gray-400">
                  Select dishes
                </span>
                <span v-else class="text-gray-800">
                  {{ restaurantDishes.join(', ') }}
                </span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </span>
              </div>
              <div
                v-if="showDishesDropdown"
                class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto"
              >
                <div
                  v-for="(dish, index) in dishesOptions"
                  :key="index"
                  class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :id="'dish-' + index"
                    :value="dish"
                    v-model="restaurantDishes"
                    class="form-checkbox text-indigo-600 mr-2"
                    @click.stop
                  />
                  <label :for="'dish-' + index" class="select-none text-gray-700">
                    {{ dish }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Certificate Checkbox -->
          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="certificate"
              class="form-checkbox h-5 w-5 text-indigo-600"
            />
            <label class="ml-2 block text-sm text-gray-700">
              Possiedi un certificato AIC?
            </label>
          </div>

          <!-- Opening Hours Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Opening Hours (comma-separated, e.g., 9-21, 9-21, 9-21)
            </label>
            <input
              v-model="openingHoursInput"
              type="text"
              placeholder="9-21, 9-21, 9-21"
              class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-1 text-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <!-- Opening Days Checkboxes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Opening Days</label>
            <div class="grid grid-cols-3 gap-2">
              <div v-for="(day) in daysOfWeek" :key="day.key" class="flex items-center">
                <input
                  type="checkbox"
                  v-model="restaurantOpeningDays[day.key]"
                  class="form-checkbox h-5 w-5 text-indigo-600"
                />
                <label class="ml-2 text-gray-700">{{ day.label }}</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition duration-150 ease-in-out"
          >
            Register
          </button>

          <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
            {{ errorMessage }}
          </p>
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
      showCategoriesDropdown: false,
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
      ],
      categoriesOptions: [
        'ristorante',
        'bar',
        'pasticceria',
        'gelateria',
        'bancarella',
        'supermercato'
      ],
      costOptions: [
        { label: '0-10 €', value: 1 },
        { label: '10-20 €', value: 2 },
        { label: '20-40 €', value: 3 },
        { label: '40-60 €', value: 4 },
        { label: '60-100 €', value: 5 },
        { label: '100+ €', value: 6 }
      ],
      selectedCost: '',
      restaurantDishes: [],
      showDishesDropdown: false,
      dishesOptions: [
        'antipasti',
        'piatti tipici',
        'pasta',
        'risotto',
        'primo di altro tipo',
        'pizza',
        'secondi',
        'fritti',
        'hamburger',
        'gelato',
        'dolci',
        'sushi',
        'birra',
        'brioche',
        'aperitivi'
      ],
      certificate: false
    };
  },
  methods: {
    toggleCategoriesDropdown() {
      this.showCategoriesDropdown = !this.showCategoriesDropdown;
    },
    toggleDishesDropdown() {
      this.showDishesDropdown = !this.showDishesDropdown;
    },
    async registerUser() {
  if (this.userFields.password.model !== this.userFields.confirmPassword.model) {
    this.errorMessage = 'Passwords do not match';
    return;
  }

  try {
    const userResponse = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/users`, {
      email: this.userFields.email.model,
      password: this.userFields.password.model,
      user_name: this.userFields.username.model,
      name: this.userFields.firstName.model,
      family_name: this.userFields.lastName.model,
      user_type: true
    });
    console.log(userResponse);
    const userId = userResponse.data.id;

    // Trasformare i giorni di apertura in un array di 1 e 0
    const openingDaysArray = [
      this.restaurantOpeningDays.monday ? 1 : 0,
      this.restaurantOpeningDays.tuesday ? 1 : 0,
      this.restaurantOpeningDays.wednesday ? 1 : 0,
      this.restaurantOpeningDays.thursday ? 1 : 0,
      this.restaurantOpeningDays.friday ? 1 : 0,
      this.restaurantOpeningDays.saturday ? 1 : 0,
      this.restaurantOpeningDays.sunday ? 1 : 0
    ];

    const openingHoursArray = this.openingHoursInput
  .split(',')
  .map(hour => hour.trim().split('-').map(num => parseInt(num, 10)))
  .filter(range => range.length === 2 && range.every(n => !isNaN(n)));

    const authenticate = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/authentications`, {
      email: userResponse.data.email,
      password: this.userFields.password.model
    });

    const token = authenticate.data.token;

    localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          id: userId,
          email: this.userFields.email.model,
          user_name: this.userFields.username.model,
          name: this.userFields.firstName.model,
          family_name: this.userFields.lastName.model,
          user_type: userResponse.data.user_type
        }));
    const restaurantResponse = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/restaurants`, {
      name: this.restaurantFields.restaurantName.model,
      address: this.restaurantFields.restaurantAddress.model,
      profile_url: this.restaurantFields.restaurantPhoto.model,
      category: this.restaurantCategories,
      price: this.selectedCost,
      email: this.userFields.email.model,
      dishes: this.restaurantDishes.map(dish => ({
  name: dish,
  url: "dummyurl.com"
})),

      opening_hours: openingHoursArray,
      opening_days: openingDaysArray, // Qui inviamo l'array corretto
      certificate: this.certificate,
      user_id: userId,
      token: token
    });
    console.log(restaurantResponse);

    this.$router.push('/');
  } catch (error) {
    console.error(error);
    this.errorMessage = 'There was an error with the registration.';
  }
}
  }
};
</script>

<style scoped>
/* You can add custom styles here */
</style>
