<template>
  <v-container>
    <!-- Titre -->
    <v-row>
      <v-col>
        <div class="text-h3">Liste des organisations</div>
      </v-col>
      <v-col>
        <v-btn @click="openDialog" >créer</v-btn>
      </v-col>
    </v-row>


    <!-- Tableau des organisations -->
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="this.orgs"
            @click:row="handleRowClick"

        >
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Boîte de dialogue pour créer une nouvelle organisation -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Créer une nouvelle organisation</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createOrganization">
            <v-text-field
                v-model="nouvelleOrg.nom"
                label="Nom de l'organisation"
                required
            ></v-text-field>
            <v-text-field
                v-model="nouvelleOrg.valeurSecrete"
                label="Mot de passe"
                type="password"
                required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="createOrganization">Valider</v-btn>
          <v-btn color="secondary" @click="closeDialog">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import store from "@/store";

export default {
  name: 'OrganizationsList',
  data() {
    return {
      headers: [
        { text: 'Nom', value: 'name', align: 'start' },
      ],
      dialog: false,
      nouvelleOrg: {
        nom: '',
        valeurSecrete: '',
      },
    };
  },
  computed: {
    ...mapState(['orgs']), // Récupère la liste des organisations depuis le store
  },
  methods: {
    ...mapActions( ['getOrganisation','createOrganisation']),
    handleRowClick(row) {
      this.selectedOrg = row;
      store.commit('setCurrentOrg',this.selectedOrg)
      console.log("Organisation sélectionnée :", row);
      this.$router.push('detail').catch(() => {});
    },


        // Ouvre la boîte de dialogue pour créer une nouvelle organisation
        openDialog() {
          this.dialog = true;
        },

        // Ferme la boîte de dialogue
        closeDialog() {
          this.dialog = false;
          this.nouvelleOrg = { nom: '', valeurSecrete: '' }; // Réitialise le formulaire
        },

            // Crée une nouvelle organisation
            async createOrganization() {
              await this.createOrganisation(this.nouvelleOrg)
              this.closeDialog();
              await this.getOrganisation(); // Met à jour la liste des organisations
            },

            // Sélectionne une organisation et redirige vers la page de détails
            viewOrganization(id) {
              this.selectOrganization(id);
              this.$router.push('detail');
            },

            // Sélectionne une organisation dans le tableau
            selectOrganization(item) {
              this.viewOrganization(item.id);
            },

  },
  async mounted() {
    await this.getOrganisation(); // Charge la liste des organisations au montage du composant
  },
};
</script>

