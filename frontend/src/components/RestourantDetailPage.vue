<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER (rimane invariato) -->
    <header class="bg-white shadow-sm">
      <div
        class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative"
      >
        <img
          src="../assets/safebites_logo.png"
          alt="Logo"
          class="h-24 w-50"
          @click="navigateTo('/Home')"
        />
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

    <!-- Immagine e dettagli del ristorante -->
    <div
      class="relative w-4/6 h-[50vh] flex items-center justify-center mx-auto mt-5"
    >
      <img
        :src="restaurant.profile_url"
        alt="Restaurant"
        class="w-full h-full object-cover rounded-2xl"
      />
      <div
        class="absolute left-28 top-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-80"
      >
        <button @click="toggleFavorite" class="absolute top-2 right-2">
          <svg
            v-if="isFavorite"
            class="w-6 h-6 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 17.75l-6.518 3.738 1.244-7.26L2 9.51l7.289-1.06L12 2.5l2.711 5.95L22 9.51l-4.726 4.717 1.244 7.26z"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </button>
        <h2 class="text-3xl font-bold text-gray-800">{{ restaurant.name }}</h2>
        <p class="text-gray-600">{{ restaurant.address }}</p>
        <p class="text-gray-600">Category: {{ restaurant.category }}</p>
        <p class="text-gray-600">Price: {{ restaurant.price }}</p>
        <p class="text-gray-600">Status: {{ isOpen ? "Open" : "Closed" }}</p>
        <p class="text-gray-600">Rating: {{ currentRating.toFixed(1) }} ⭐ ({{ totalRatings }} ratings)</p>
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
    <section class="max-w-7xl mx-auto mt-10">
      <h2 class="text-2xl font-bold text-red-700 mb-4">
        RATE THIS RESTAURANT:
      </h2>

      <!-- Stelle di valutazione -->
      <div class="flex items-center mb-2">
        <div class="flex items-center">
          <span
            v-for="star in 5"
            :key="star"
            class="cursor-pointer"
            @click="setRating(star)"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
          >
            <svg
              class="w-8 h-8 transition-colors duration-200"
              :class="[
                (hoverRating || newRating || currentRating) >= star
                  ? 'text-red-500 fill-current'
                  : 'text-gray-300 fill-transparent',
                'stroke-current stroke-2',
              ]"
              viewBox="0 0 24 24"
            >
              <path
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </span>
        </div>
        <span class="ml-2 text-gray-600">
          {{ currentRating.toFixed(1) }} ({{ totalRatings }} ratings)
        </span>
      </div>

      <!-- Messaggi e pulsante di invio -->
      <div v-if="isLoggedIn">
        <p class="text-gray-600 mb-2">
          Your rating: {{ newRating || userRating || "Not rated yet" }}
        </p>
        <button
          @click="submitRating"
          :disabled="!newRating"
          class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Rating
        </button>
      </div>
      <div v-else>
        <p class="text-red-500">
          You must be logged in to rate this restaurant.
        </p>
      </div>
    </section>

    <!-- Sezione RECENSIONI -->
    <section class="max-w-7xl mx-auto mt-10">
      <h2 class="text-2xl font-bold text-red-700 mb-4">REVIEWS:</h2>

      <!-- Lista delle recensioni -->
      <div v-if="reviews.length > 0" class="space-y-4">
    <div
      v-for="(review, index) in reviews"
      :key="index"
      class="bg-white p-4 rounded-lg shadow-md relative"
    >
      <button
        v-if="currentUserId === review.user_id"
        @click="deleteReview(review)"
        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        Delete
      </button>
      <p class="text-gray-700">{{ review.text }}</p>
      <p class="text-gray-500 text-sm">By user: {{ review.username }}</p>
    </div>
  </div>
      <div v-else>
        <p class="text-gray-600">No reviews yet.</p>
      </div>

      <!-- Form per lasciare una recensione (visibile solo se l'utente è loggato) -->
      <div class="mt-6">
        <h3 class="text-xl font-semibold">Leave a Review</h3>
        <div v-if="isLoggedIn">
          <textarea
            v-model="newReviewText"
            rows="3"
            placeholder="Write your review here..."
            class="w-full p-2 border rounded-lg"
          ></textarea>
          <button
            @click="submitReview"
            class="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Submit Review
          </button>
        </div>
        <div v-else>
          <p class="text-red-500">You must be logged in to leave a review.</p>
        </div>
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
        id: '',
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
      isFavorite: false,
      reviews: [],
      newReviewText: '',
      currentRating: 0,
      userRating: null,
      newRating: 0,
      hoverRating: 0,
      totalRatings: 0
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  },
  async created() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) this.currentUserId = user.id;
    await this.fetchRestaurantData();
  },
  methods: {
    async fetchRestaurantData() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/restaurants/${this.$route.params.id}`);
        this.restaurant = response.data;
        this.checkOpenStatus();
        
        if (this.isLoggedIn) {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRes = await axios.get(
    `${process.env.VUE_APP_API_URL}/api/v1/users/${user.id}`,
    { 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    } // ✅ Corrected closing bracket here
  );
  this.isFavorite = userRes.data.favourite_list.includes(this.restaurant.id);
}
        
        await Promise.all([this.fetchReviews(), this.fetchRatings()]);
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
    setRating(star) {
    if (this.isLoggedIn) {
      this.newRating = star;
    }
  },
  async fetchRatings() {
    try {
        const response = await axios.get(
            `${process.env.VUE_APP_API_URL}/api/v1/ratings/${this.restaurant.id}`
        );
        
        const ratings = response.data.ratings;
        this.totalRatings = ratings.length;
        
        if (this.totalRatings > 0) {
            const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
            this.currentRating = sum / this.totalRatings;
        } else {
            this.currentRating = 0;
        }
    } catch (error) {
        console.error('Error fetching ratings:', error);
        this.currentRating = 0;
        this.totalRatings = 0;
    }
},
async toggleFavorite() {
      if (!this.isLoggedIn) {
        alert('Please login to add favorites');
        return;
      }
      
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      try {
        // Get current user data
        const userRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/v1/users/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update favorite list
        const newFavorites = userRes.data.favourite_list.includes(this.restaurant.id)
          ? userRes.data.favourite_list.filter(id => id !== this.restaurant.id)
          : [...userRes.data.favourite_list, this.restaurant.id];

        // Update user
        await axios.put(
          `${process.env.VUE_APP_API_URL}/api/v1/users/${user.id}`,
          {
            ...userRes.data,
            favourite_list: newFavorites,
            token: token
          }
        );

        // Update local state
        this.isFavorite = !this.isFavorite;
        localStorage.setItem('user', JSON.stringify({
          ...user,
          favourite_list: newFavorites
        }));
      } catch (error) {
        console.error('Error updating favorites:', error);
        alert('Failed to update favorites.');
      }
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    conditionalNavigateTo(){
    if(localStorage.getItem('token')){
        const user = JSON.parse(localStorage.getItem('user'));
        if(user.user_type == 'true'){
            this.navigateTo('/RestaurantPrivate');
        }
        else{
          this.navigateTo('/UserPage');
        }
    }
    else{
      this.navigateTo('/Access');
    }
},
async deleteReview(review) {
      if (!confirm('Are you sure you want to delete this review?')) return;
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${process.env.VUE_APP_API_URL}/api/v1/reviews/${this.restaurant.id}?user_id=${review.user_id}`,
          { data: { token } }
        );
        await this.fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        alert(error.response?.data?.error || 'Failed to delete review.');
      }
    },
    loadRestaurants() {
      // Implementa la logica per il caricamento dei ristoranti, se necessario
    },
    async submitReview() {
    if (!this.isLoggedIn) {
        alert('You must be logged in to leave a review.');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !user.id || !token) {
        alert('Session expired. Please log in again.');
        return;
    }

    try {
        // Check for existing review
        const existingReview = await this.getUserReview(user.id);

        const payload = {
            restaurant_id: this.restaurant.id, // Match backend field name
            user_id: user.id,
            text: this.newReviewText,
            token: token // Include token in body
        };

        if (existingReview) {
            // Update existing review using PUT
            await axios.put(
                `${process.env.VUE_APP_API_URL}/api/v1/reviews/${this.restaurant.id}?user_id=${user.id}`,
                payload
            );
        } else {
            // Create new review using POST
            await axios.post('${process.env.VUE_APP_API_URL}/api/v1/reviews', payload);
        }

        alert('Review submitted successfully!');
        this.newReviewText = '';
        this.fetchReviews(); // Refresh the list

    } catch (error) {
        console.error('Error submitting review:', error);
        alert(error.response?.data?.error || 'Error submitting review.');
    }
},
async fetchReviews() {
    try {
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/api/v1/reviews/${this.restaurant.id}` 
      );
      
      // Fetch usernames for each review
      const reviewsWithUsernames = await Promise.all(
        res.data.reviews.map(async review => {
          try {
            const userRes = await axios.get(
              `${process.env.VUE_APP_API_URL}/api/v1/users/${review.user_id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );
            return { 
              ...review,
              username: userRes.data.user_name
            };
          } catch (error) {
            console.error('Error fetching username:', error);
            return { ...review, username: 'Anonymous' };
          }
        })
      );

      this.reviews = reviewsWithUsernames;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      this.reviews = [];
    }
  },

async getUserReview(userId) {
    try {
        const response = await axios.get(
            `${process.env.VUE_APP_API_URL}/api/v1/reviews/${this.restaurant.id}?user_id=${userId}`
        );
        return response.data.reviews.length > 0 ? response.data.reviews[0] : null;
    } catch (error) {
        return null;
    }
},
    async submitRating() {
    if (!this.isLoggedIn) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !user.id || !token) {
        alert('Session expired. Please log in again.');
        return;
    }

    try {
        // Check for existing rating
        const existingRating = await this.getUserRating(user.id);

        const payload = {
            restaurant_id: this.restaurant.id, // Match backend field name
            user_id: user.id,
            rating: this.newRating,
            token: token // Include token in the body
        };

        if (existingRating) {
            // Update rating: include all required fields in the body
            await axios.put(
                `${process.env.VUE_APP_API_URL}/api/v1/ratings/${this.restaurant.id}?user_id=${user.id}`,
                payload // Send full payload
            );
        } else {
            // Create new rating
            await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/ratings`, payload);
        }

        // Refresh ratings and update 
        await this.fetchRatings();
        this.userRating = this.newRating;
        alert('Rating submitted successfully!');
        
        // Optional: Fetch updated average rating
        // await this.fetchAverageRating();

    } catch (error) {
        console.error('Error submitting rating:', error);
        alert(error.response?.data?.error || 'Error submitting rating.');
    }
},

async getUserRating(userId) {
    try {
        const response = await axios.get(
            `${process.env.VUE_APP_API_URL}/api/v1/ratings/${this.restaurant.id}?user_id=${userId}`,
        );
        return response.data.ratings.length > 0 ? response.data.ratings[0] : null;
    } catch (error) {
        return null; // Nessuna valutazione trovata o errore
    }
},
   }
};
</script>

<style scoped>
/* Aggiungi eventuali stili personalizzati qui */
</style>
