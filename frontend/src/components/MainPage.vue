<template>
  <div class="p-8">
    <!-- HEADER -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
        <img src="../assets/safebites_logo.png" alt="Logo" class="h-24 w-50" @click="navigateTo('/Home')"/>

        <!-- SEARCH BAR -->
        <div class="relative text-gray-600">
          <input 
            type="search" 
            v-model="searchQuery" 
            placeholder="Search"
            class="bg-white h-12 w-96 mt-5 -ml-52 border-4 px-5 pr-10 rounded-full text-sm focus:outline-none"
          />
          <button type="button" @click="loadRestaurants" class="absolute right-0 top-0 mt-9 mr-4">
            <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.966 56.966">
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>

        <!-- USER ICON -->
        <div class="flex items-center space-x-2">
          <img src="../assets/user_icon.png" alt="User" class="h-14 w-14 mt-4" @click="conditionalNavigateTo()" />
        </div>
      </div>
    </header>

    <!-- FILTRI: ICONE -->
    <div class="mt-8 mx-auto items-center w-3/5">
      <h2 class="text-lg font-bold mb-4">Filtra per:</h2>
      <div class="flex justify-evenly">
        <!-- VICINANZA: NON HA POPUP -->
        <div @click="toggleVicinanza" class="flex flex-col items-center cursor-pointer">
          <img :src="filters.vicinanza ? '/img/icon/green/vicinanza.svg' : '/img/icon/red/vicinanza.svg'" alt="Vicinanza" class="h-12 w-12" />
          <p class="text-sm">Vicinanza</p>
        </div>

        <!-- CATEGORIA -->
        <div @click="openPopup('categoria')" class="flex flex-col items-center cursor-pointer">
          <img :src="filters.categoria.length > 0 ? '/img/icon/green/categoria.svg' : '/img/icon/red/categoria.svg'" alt="Categoria" class="h-12 w-12" />
          <p class="text-sm">Categoria</p>
        </div>

        <!-- PIETANZE -->
        <div @click="openPopup('pietanze')" class="flex flex-col items-center cursor-pointer">
          <img :src="filters.pietanze.length > 0 ? '/img/icon/green/pietanze.svg' : '/img/icon/red/pietanze.svg'" alt="Pietanze" class="h-12 w-12" />
          <p class="text-sm">Pietanze</p>
        </div>

        <!-- ORARIO -->
        <div @click="openPopup('orario')" class="flex flex-col items-center cursor-pointer">
          <img :src="filters.orario !== null ? '/img/icon/green/orario.svg' : '/img/icon/red/orario.svg'" alt="Orario" class="h-12 w-12" />
          <p class="text-sm">Orario</p>
        </div>

        <!-- COSTO -->
        <div @click="openPopup('costo')" class="flex flex-col items-center cursor-pointer">
          <img :src="filters.costo !== null ? '/img/icon/green/costo.svg' : '/img/icon/red/costo.svg'" alt="Costo" class="h-12 w-12" />
          <p class="text-sm">Costo</p>
        </div>

        <!-- VALUTAZIONI -->
        <div @click="openPopup('valutazioni')" class="flex flex-col items-center cursor-pointer">
          <img :src="filters.valutazioni !== null ? '/img/icon/green/valutazioni.svg' : '/img/icon/red/valutazioni.svg'" alt="Valutazioni" class="h-12 w-12" />
          <p class="text-sm">Valutazioni</p>
        </div>
      </div>
    </div>

    <!-- TOLLERANZA ALLE CONTAMINAZIONI SWITCH (sotto i filtri, sopra la mappa) -->
    <div class="flex justify-center mt-8">
      <span class="ml-2 mr-3">Tolleranza alle contaminazioni</span>
      <label class="switch">
        <input type="checkbox" v-model="tolleranzaContaminazioni" @change="loadRestaurants" />
        <span class="slider"></span>
      </label>
      
    </div>

    <!-- POPUP DI SELEZIONE -->
    <div v-if="popupVisible" class="popup-overlay">
      <div class="popup-content">
        <div class="popup-header">
          <h3 class="font-bold text-xl">{{ popupTitle }}</h3>
          <button @click="closePopup" class="text-xl font-semibold">X</button>
        </div>
        <!-- Popup per CATEGORIA: selezione multipla -->
        <div v-if="popupType === 'categoria'">
          <ul>
            <li v-for="option in categories" :key="option" @click="selectMultipleOption('categoria', option)">
              <span :class="{ selected: filters.categoria.includes(option) }">{{ option }}</span>
            </li>
          </ul>
        </div>
        <!-- Popup per PIETANZE: selezione multipla -->
        <div v-else-if="popupType === 'pietanze'">
          <ul>
            <li v-for="option in dishes" :key="option" @click="selectMultipleOption('pietanze', option)">
              <span :class="{ selected: filters.pietanze.includes(option) }">{{ option }}</span>
            </li>
          </ul>
        </div>
        <!-- Popup per ORARIO: selezione singola -->
        <div v-else-if="popupType === 'orario'">
          <ul>
            <li v-for="option in hours" :key="option" @click="selectSingleOption('orario', option)">
              <span :class="{ selected: filters.orario === option }">{{ option }}:00</span>
            </li>
          </ul>
        </div>
        <!-- Popup per COSTO: selezione singola -->
        <div v-else-if="popupType === 'costo'">
          <ul>
            <li v-for="(label, value) in costOptions" :key="value" @click="selectSingleOption('costo', Number(value))">
              <span :class="{ selected: filters.costo === Number(value) }">{{ label }}</span>
            </li>
          </ul>
        </div>
        <!-- Popup per VALUTAZIONI: selezione singola -->
        <div v-else-if="popupType === 'valutazioni'">
          <ul>
            <li v-for="option in [1,2,3,4,5]" :key="option" @click="selectSingleOption('valutazioni', option)">
              <span :class="{ selected: filters.valutazioni === option }">{{ option }} stelle</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ELENCO RISTORANTI E MAPPA -->
    <div class="flex flex-row h-full mt-8">
      <div class="flex flex-wrap justify-evenly w-3/5">
        <CardMainPage v-for="(restaurant, index) in restaurants" :key="index" :restaurant="restaurant" />
      </div>
      <div class="bg-zinc-300 rounded-xl w-2/5 mr-7 min-h-[800px] mt-4">
        <GoogleMap :restaurants="restaurants" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import CardMainPage from './CardMainPage.vue';
import GoogleMap from './GoogleMap.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const restaurants = ref([]);
const searchQuery = ref("");
const tolleranzaContaminazioni = ref(false);

const filters = ref({
  vicinanza: false,
  orario: null,
  categoria: [],
  pietanze: [],
  costo: null,
  valutazioni: null
});

const categories = ref(["Ristorante", "Bar", "Pasticceria", "Gelateria", "Bancarella", "Supermercato"]);
const dishes = ref(['Antipasti',
        'Piatti tipici',
        'Pasta',
        'Risotto',
        'Primo di altro tipo',
        'Pizza',
        'Secondi',
        'Fritti',
        'Hamburger',
        'Gelato',
        'Dolci',
        'Sushi',
        'Birra',
        'Brioche',
        'Aperitivi']);
const hours = ref(Array.from({ length: 24 }, (_, i) => i));
const costOptions = ref({
  1: "0-10 €",
  2: "10-20 €",
  3: "20-40 €",
  4: "40-60 €",
  5: "60-100 €",
  6: "100+ €"
});

const popupVisible = ref(false);
const popupType = ref(null);
const popupTitle = ref("");

function openPopup(type) {
  if (type === 'vicinanza') return; // Nessun popup per vicinanza
  popupType.value = type;
  switch (type) {
    case 'categoria': popupTitle.value = "Seleziona Categoria"; break;
    case 'pietanze': popupTitle.value = "Seleziona Pietanze"; break;
    case 'orario': popupTitle.value = "Seleziona Orario"; break;
    case 'costo': popupTitle.value = "Seleziona Costo"; break;
    case 'valutazioni': popupTitle.value = "Seleziona Valutazioni"; break;
    default: popupTitle.value = "";
  }
  popupVisible.value = true;
}
function closePopup() {
  popupVisible.value = false;
}

function selectMultipleOption(filterKey, option) {
  const arr = filters.value[filterKey];
  const index = arr.indexOf(option);
  if (index === -1) {
    arr.push(option);
  } else {
    // Se già selezionato, rimuovi (toggle)
    arr.splice(index, 1);
  }
  loadRestaurants();
  closePopup();
}

function selectSingleOption(filterKey, option) {
  // Se l'opzione è già selezionata, la deseleziona
  if (filters.value[filterKey] === option) {
    filters.value[filterKey] = null;
  } else {
    filters.value[filterKey] = option;
  }
  loadRestaurants();
  closePopup();
}

function toggleVicinanza() {
  filters.value.vicinanza = !filters.value.vicinanza;
  loadRestaurants();
}

async function loadRestaurants() {
  try {
    console.log(process.env.VUE_APP_API_URL);
    const response = await axios.get(`https://safebites.onrender.com/api/v1/restaurants`, {
      params: {
        search: searchQuery.value ? [searchQuery.value] : [],
        vicinanza: filters.value.vicinanza,
        orario: filters.value.orario,
        categoria: filters.value.categoria,
        pietanze: filters.value.pietanze,
        costo: filters.value.costo,
        valutazioni: filters.value.valutazioni,
        tolleranzaContaminazioni: tolleranzaContaminazioni.value
      }
    });
    restaurants.value = response.data;

    console.log("Risposta API:", response);
    
    // Se vuoi stampare solo i dati:
    console.log("Dati API:", response.data);
  } catch (error) {
    console.error("Errore nel caricamento dei ristoranti:", error);
  }
}

watch([searchQuery, tolleranzaContaminazioni, filters], () => {
  loadRestaurants();
}, { deep: true });

function navigateTo(route) {
  router.push(route);
}
const conditionalNavigateTo = () => {
    if(localStorage.getItem('token')){
        const user = JSON.parse(localStorage.getItem('user'));
        if(user.user_type == 'true'){
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

loadRestaurants();
</script>

<style scoped>
/* Popup styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.popup-content ul {
  list-style: none;
  padding: 0;
}
.popup-content li {
  padding: 5px;
  cursor: pointer;
}
.popup-content li:hover {
  background-color: #eee;
}
.selected {
  font-weight: bold;
  color: green;
}

/* Stili per lo switch on-off */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: red;
  transition: .4s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #287233;
}
input:checked + .slider:before {
  transform: translateX(26px);
}
</style>
