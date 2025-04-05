<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Liste des équipes</span>
        <v-btn
            color="primary"
            @click="showCreateDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Nouvelle équipe
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-data-table
            :headers="headers"
            :items="this.teams"
            :loading="loading"
            :items-per-page="10"
            class="elevation-1"
        >
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showCreateDialog" max-width="500">
      <v-card>
        <v-card-title>Créer une nouvelle équipe</v-card-title>
        <v-card-text>
          <v-text-field
              v-model="newTeamName"
              label="Nom de l'équipe"
              :rules="[requiredRule]"
              outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancelCreate">Annuler</v-btn>
          <v-btn
              color="primary"
              @click="createTeamOnClick"
              :disabled="!newTeamName"
              :loading="creating"
          >
            Créer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";

export default {
  data() {
    return {
      loading: false,
      showCreateDialog: false,
      creating: false,
      newTeamName: '',
      headers: [
        { text: 'Nom', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      requiredRule: v => !!v || 'Champ obligatoire'
    }
  },

  computed: {
    ...mapState(['teams'])
  },

  async created() {
    await this.loadTeams()
  },

  methods: {
    ...mapMutations(['setCurrentTeam']),
    ...mapActions(['getTeams','createTeam']),
    async loadTeams() {
      this.loading = true
      try {
        await this.getTeams()
      } catch (error) {
        console.error("Erreur chargement équipes:", error)
      } finally {
        this.loading = false
      }
    },
    async createTeamOnClick() {
      await this.createTeam(this.newTeamName)
      await this.getTeams()
    },

    cancelCreate() {
      this.showCreateDialog = false
      this.newTeamName = ''
    },
  }
}
</script>