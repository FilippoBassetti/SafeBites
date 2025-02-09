import { createRouter, createWebHistory } from 'vue-router';
import LogInRegisterPage from '@/components/LogInRegisterPage.vue';
import MainPage from '../components/MainPage.vue';
import FoodTraditionPage from '../components/FoodTraditionPage.vue';
import EnogastronomicPaths from '../components/EnogastronomicsPaths.vue';
import UserPage from '@/components/UserPage.vue';
import RestourantDetailPage from '@/components/RestourantDetailPage.vue';
import HomePage from '@/components/HomePage.vue';
import RestaurantPrivatePage from '@/components/RestaurantPrivatePage.vue';
import RestaurantRegistration from '@/components/RestaurantRegistration.vue';

const routes = [
  {
    path: '/Access',
    name: 'Access',
    component: LogInRegisterPage,
  },
  {
    path: '/Home',
    name: 'HomePage',
    component: HomePage,
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
  },
   { path: '/restaurant/:id', 
     component: RestourantDetailPage, 
     props: true 
    },
     {
      path: '/RestaurantPrivate',
      name: 'RestaurantPrivate',
      component: RestaurantPrivatePage,
    },
    {
      path: '/RestaurantRegister',
      name: 'RestaurantRegister',
      component: RestaurantRegistration,
    }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;