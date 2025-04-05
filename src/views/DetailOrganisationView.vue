<template>
  <v-container v-if="currentOrg">
    <v-card>
      <v-card-title>
        {{ this.currentOrg.name }}
      </v-card-title>

      <v-card-text>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>

        <h3 class="text-h5 mb-4">Équipes</h3>

        <v-btn color="primary" @click="showAddTeam = true" class="mb-4">
          Ajouter une équipe
        </v-btn>

        <v-data-table
            :headers="teamHeaders"
            :items="currentOrg.teams"
            :loading="loading"
        >
          <template slot="item.name" slot-scope="{ item }">
            <td>{{ item.name }}</td>
          </template>
          <template slot="item.actions" slot-scope="{ item }">
            <td class="text-right pa-2">
              <v-btn
                  color="primary"
                  small
                  @click="selectTeam(item)"
                  class="mr-2"
              >
                Sélectionner
              </v-btn>
              <v-btn
                  color="error"
                  small
                  @click="openDeleteDialog(item._id)"
              >
                Supprimer
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card-text>

    </v-card>

    <!-- Dialogue d'ajout d'équipe -->
    <v-dialog v-model="showAddTeam" max-width="500">
      <v-card>
        <v-card-title>Ajouter une équipe</v-card-title>
        <v-card-text>
          <v-select
              v-model="selectedTeam"
              :items="availableTeams"
              label="Équipes disponibles"
              item-text="name"
              return-object
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showAddTeam = false">Annuler</v-btn>
          <v-btn
              color="primary"
              @click="addTeamToOrg"
              :disabled="!selectedTeam"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogue d'erreur -->
    <v-dialog v-model="showErrorDialog" persistent max-width="400">
      <v-card>
        <v-card-title>Aucune organisation à afficher</v-card-title>
        <v-card-text>
          Impossible de charger les données de l'organisation.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="returnToList">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isConfirmDeleteOpen" max-width="400">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir retirer cette équipe de l'organisation ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isConfirmDeleteOpen = false">Annuler</v-btn>
          <v-btn color="error" @click="confirmDeleteTeam(teamToRemove)">Confirmer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <v-container v-else>
    <div class="text-h6 pa-5">Valeur Secrète fausse ou manquante</div>
  </v-container>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex';
export default {
  data() {
    return {
      loading: false,
      isConfirmDeleteOpen: false,
      error: null,
      showAddTeam: false,
      selectedTeam: null,
      showErrorDialog: false,
      teamToRemove: null,
      teamHeaders: [
        { text: 'Nom', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'end' }
      ]
    }
  },

  async created() {
    console.log("creation")
    await this.loadOrganization()
  },

  computed: {
    availableTeams() {
      const currentTeamIds = this.currentOrg?.teams?.map(t => t._id) || []
      return this.teams.filter(
          team => !currentTeamIds.includes(team._id)
      )
    },
    ...mapState(['currentOrg','teams','motDePasseOrg'])
  },

  methods: {
    ...mapActions(['getOrganisationById','getTeams','addTeamsToOrg','removeTeamFromOrg']),
    ...mapMutations(['setCurrentTeam']),
    async loadOrganization() {
      this.loading = true
      this.error = null

      try {
        // On attend bien la fin de l'action
        await this.getOrganisationById()

        console.log(this.currentOrg)
        if (!this.currentOrg) {
          this.showErrorDialog = true
        }
      } catch (err) {
        this.error = "Erreur lors du chargement"
        this.showErrorDialog = true
      } finally {
        this.loading = false
        await this.getTeams()
      }
    },

    selectTeam(team) {
      console.log(team)
      this.setCurrentTeam(team)
      this.$router.push(`team`)
    },

    async confirmDeleteTeam(team) {
      await this.removeTeamFromOrg(team)
      this.isConfirmDeleteOpen = false
    },

    async addTeamToOrg() {
      if (this.selectedTeam) {
        await this.addTeamsToOrg(this.selectedTeam._id)
        this.showAddTeam = false
        this.selectedTeam = null
        await this.loadOrganization() // Rafraîchit les données
      }
    },

    returnToList() {
      this.$router.push('/organisations')
    },
    openDeleteDialog(id){
      console.log(id)
      this.teamToRemove = id;
      this.isConfirmDeleteOpen = true
    }
  },

}
</script>