<template>
  <div 
    @click="goToDetails"
    class="h-[26rem] w-[20rem] ml-2 bg-pink-50 rounded-xl justify-center align-middle flex flex-col p-4 mt-4 shadow-lg cursor-pointer transition hover:shadow-xl"
  >
    <div>
      <img :src="restaurant.profile_url" alt="Restaurant Image" class="w-full h-[12rem] object-cover rounded-lg">
    </div>
    <div class="mt-4">
      <h2 class="text-lg font-bold">{{ restaurant.name }}</h2>
      <p class="text-sm text-gray-600">{{ restaurant.address }}</p>
      <p class="text-sm text-gray-600">Category: {{ restaurant.category }}</p>
      <p class="text-sm text-gray-600">Price: {{ priceRange }}</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'CardMainPage',
  props: ['restaurant'],
  setup(props) {
    const router = useRouter();
    
    const priceRange = computed(() => {
      const ranges = ['0-10', '10-20', '20-40', '40-60', '60-100', '100+'];
      return ranges[props.restaurant.price - 1] || 'Unknown';
    });

    const goToDetails = () => {
      router.push({
        path: `/restaurant/${props.restaurant.id}`,
        state: { restaurant: props.restaurant }
      });
    };

    return { goToDetails, priceRange };
  }
};
</script>
