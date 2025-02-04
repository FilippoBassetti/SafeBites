<template>
  <div class="p-8">
    <!-- Header -->
    <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
                <img src="../assets/safebites_logo.png" class="h-24 w-50">

                <!-- Centered Searchbar -->
                <div class="relative text-gray-600">
                    <input type="search" name="search" placeholder="Search"
                        class="bg-white h-12 w-96 mt-5 -ml-52 border-4 px-5 pr-10 rounded-full text-sm focus:outline-none">
                    <button type="submit" class="absolute right-0 top-0 mt-9 mr-4">
                        <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"
                            viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;"
                            xml:space="preserve" width="512px" height="512px">
                            <path
                                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                    </button>
                </div>

                <!-- User Icon -->
                <div class="flex items-center space-x-2">
                    <img src="../assets/user_icon.png" class="h-14 w-14 mt-4"
                    @click="navigateTo('/userPage')">
                </div>
            </div>
        </header>

    
    <div class="flex flex-row">
      <div class="flex flex-wrap justify-evenly mt-8 w-3/5">
        <CardMainPage />
        <CardMainPage />
        <CardMainPage />
        <CardMainPage />
        <CardMainPage />
        <CardMainPage />
      </div>
      <div class="bg-zinc-300 mt-12 rounded-xl w-2/5 mr-7"> 
        <img src="../../public/img/image 10.png" class="w-full h-full object-cover rounded-xl">
      </div>
    </div>
  </div>


</template>
<script setup>
import CardMainPage from './CardMainPage.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (route) => {
    router.push(route);
}; 
</script>
