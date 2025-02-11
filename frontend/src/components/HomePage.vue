<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
                <img src="../assets/safebites_logo.png" class="h-24 w-50">
                <!-- User Icon -->
                <div class="flex items-center space-x-2">
                    <img src="../assets/user_icon.png" class="h-14 w-14 mt-4"
                    @click="conditionalNavigateTo()">
                </div>
            </div>
        </header>

        <div class="min-h-screen bg-gray-50">
            <!-- Header remains unchanged -->

            <!-- Carousel Section -->
            <main class="max-w-4xl mx-auto px-4 py-12 mt-40">
                <div class="relative flex items-center">
                    <!-- Prev Button -->
                    <button @click="prevSlide"
                        class="absolute -left-16 w-12 h-12 flex items-center justify-center bg-white border-2 border-red-500 rounded-full hover:border-pink-500 transition-colors">
                        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <!-- Carousel Container -->
                    <div class="relative overflow-hidden rounded-xl shadow-lg w-full">
                        <div class="flex transition-transform duration-300 ease-in-out flex-nowrap"
                            :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                            <div v-for="(slide, index) in slides" :key="index"
                                class="w-full flex-shrink-0 h-96 flex items-center justify-center bg-pink-50 cursor-pointer hover:shadow-lg transition-shadow"
                                @click="navigateTo(slide.route)">
                                <div class="text-center p-8 -mt-2">
                                    <p class="text-red-600 text-5xl font-agatholight">{{ slide.content }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Next Button -->
                    <button @click="nextSlide"
                        class="absolute -right-16 w-12 h-12 flex items-center justify-center bg-white border-2 border-red-500 rounded-full hover:border-pink-500 transition-colors">
                        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <!-- External Indicators -->
                <div class="flex justify-center mt-6 space-x-2">
                    <button v-for="(slide, index) in slides" :key="index" @click="goToSlide(index)"
                        class="w-3 h-3 rounded-full transition-colors duration-300"
                        :class="currentSlide === index ? 'bg-red-500' : 'bg-gray-300'"></button>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentSlide = ref(0);

const slides = [
    {
        title: "Page 1",
        content: "RISTORANTI VICINI A TE",
        route: "/MainPage"
    }
];

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index) => {
    currentSlide.value = index;
};

const navigateTo = (route) => {
    router.push(route);
};
const conditionalNavigateTo = () => {
    if(localStorage.getItem('token')){
        const user = JSON.parse(localStorage.getItem('user'));
        if(user.user_type == true){
            navigateTo('/RestaurantPrivate');
        }
        else{
            navigateTo('/UserPage');
        }
    }
    else{
        navigateTo('/Access');
    }
};
</script>
<style>
.flex {
    transition: transform 0.5s ease-in-out;
}
</style>