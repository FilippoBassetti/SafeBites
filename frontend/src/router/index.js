import { createRouter, createWebHashHistory } from 'vue-router';
import LogInRegisterPage from '@/components/LogInRegisterPage.vue';
import MainPage from '../components/MainPage.vue';
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
    path: '/',
    redirect: '/Home' // Reindirizza automaticamente alla pagina Home
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
  history: createWebHashHistory(), // Uses hash mode
  routes
});

export default router;