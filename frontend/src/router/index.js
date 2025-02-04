import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import MainPage from '../components/MainPage.vue';
import FoodTraditionPage from '../components/FoodTraditionPage.vue';
import EnogastronomicPaths from '../components/EnogastronomicsPaths.vue';
import UserPage from '@/components/UserPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/MainPage',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/TraditionalFood',
    name: 'TraditionalFood',
    component: FoodTraditionPage
  },
  {
    path: '/EnogastronomicPaths',
    name: 'EnogastronomicPaths',
    component: EnogastronomicPaths
  },
  {
    path: '/UserPage',
    name: 'UserPage',
    component: UserPage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;