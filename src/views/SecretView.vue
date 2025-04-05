<template>
  <v-card>
    <v-card-title>Authentification requise</v-card-title>
    <v-card-text>
      <v-text-field
          v-model="secretInput"
          label="Phrase secrète"
          :type="showSecret ? 'text' : 'password'"
          :append-icon="showSecret ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="showSecret = !showSecret"
          outlined
          clearable
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="cancel">Annuler</v-btn>
      <v-btn color="primary" @click="validate">Valider</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      secretInput: '',
      showSecret: false
    }
  },
  methods: {
    validate() {
      console.log(this.secretInput);
      this.$store.commit('setMotDePasse', this.secretInput);
      router.push('/');
    },
    cancel() {
      this.secretInput = ''
      router.push('/')
    }
  }
}
</script>