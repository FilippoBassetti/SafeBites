<template>
  <div class="h-[18rem] w-[14rem] ml-2 bg-pink-50 rounded-xl flex flex-col p-4 mt-4 mb-6">
    <div class="flex-grow flex items-center justify-center">
      <!-- Visualizza il nome del piatto ricostruito -->
      <p class="text-green-700 font-semibold text-xl">{{ dishName }}</p>
    </div>
    <!-- Se in futuro vuoi aggiungere un'immagine o altro, puoi farlo qui -->
  </div>
</template>

<script>
export default {
  name: 'MenuCard',
  props: {
    dish: {
      type: Object,
      required: true
    }
  },
  computed: {
    dishName() {
      // Filtra le chiavi che sono numeriche (quelle che rappresentano i caratteri)
      // Ordina le chiavi e unisci i caratteri per formare la stringa
      return Object.keys(this.dish)
        .filter(key => /^\d+$/.test(key)) // solo chiavi composte da sole cifre
        .sort((a, b) => a - b)
        .map(key => this.dish[key])
        .join('');
    }
  }
}
</script>
