<template>
  <div class="add-member-form">
    <h3>Ajouter un membre à l'équipe</h3>
    <!-- Ici vous mettrez votre formulaire plus tard -->

    <v-btn @click="$router.back()" class="mt-4">
      Retour
    </v-btn>
  </div>
</template>

<script>
export default {
  props: ['id'],
  created() {
    // this.id contient l'ID de l'équipe
    console.log('Ajout membre pour équipe:', this.id)
  }
}
</script>