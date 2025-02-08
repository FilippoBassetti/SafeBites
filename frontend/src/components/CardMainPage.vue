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
      <p class="text-sm text-gray-600">Price: {{ restaurant.price }}</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'CardMainPage',
  props: ['restaurant'], // Riceve i dati come prop
  setup(props) {
    const router = useRouter();
    console.log(props.restaurant.id);
    const goToDetails = () => {
      router.push({
        path: `/restaurant/${props.restaurant.id}`,
        state: { restaurant: props.restaurant } // Passa i dati al navigatore
      });
    };

    return { goToDetails };
  }
};
</script>
