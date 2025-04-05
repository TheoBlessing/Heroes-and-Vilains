

<template>
  <div v-if="currentTeam">
      <div class="d-flex justify-space-between align-center mb-4 pa-4">
        <h2>{{ currentTeam.name }}</h2>
        <v-btn color="primary" @click="isAddMemberDialogOpen = true">
          Ajouter un membre
        </v-btn>
      </div>

    <v-data-table
        :headers="heroHeaders"
        :items="teamHeroes"
        :items-per-page="10"
        item-key="_id"
        class="elevation-1"
    >
      <!-- Colonne Nom public - Vue 2 syntax -->
      <template slot="item.publicName" slot-scope="{ item }">
        <span>{{ item.publicName || '-' }}</span>
      </template>

      <!-- Colonne Nom réel - Vue 2 syntax -->
      <template slot="item.realName" slot-scope="{ item }">
        <span>{{ item.realName || '-' }}</span>
      </template>

      <!-- Colonne Pouvoirs - Vue 2 syntax -->
      <template slot="item.powers" slot-scope="{ item }">
        <div v-if="item.powers && item.powers.length">
          <v-chip
              v-for="(power, index) in item.powers"
              :key="index"
              small
              class="ma-1"
          >
            {{ power.name }} (niv. {{ power.level }})
          </v-chip>
        </div>
        <span v-else class="grey--text">Aucun pouvoir</span>
      </template>

      <!-- Colonne Actions - Vue 2 syntax -->
      <template slot="item.actions" slot-scope="{ item }">
        <v-btn small color="primary" @click="openEditDialog(item)" class="mr-2">
          Modifier
        </v-btn>
        <v-btn small color="error" @click="confirmRemoveMember(item._id)">
          Retirer
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="isAddMemberDialogOpen" max-width="800" persistent>
      <v-card>
        <v-card-title>Ajouter un membre à {{ currentTeam.name }}</v-card-title>
        <v-tabs v-model="addMemberTab">
          <v-tab>Héros existant</v-tab>
          <v-tab>Nouveau héros</v-tab>
        </v-tabs>
        <v-tabs-items v-model="addMemberTab">
          <!-- Onglet Héros existant -->
          <v-tab-item>
            <v-card-text>
              <v-data-table
                  :headers="availableHeroHeaders"
                  :items="availableHeroes"
                  @click:row="addExistingMember"
              ></v-data-table>
            </v-card-text>
          </v-tab-item>

          <!-- Onglet Nouveau héros -->
          <v-tab-item>
            <v-card-text>
              <v-form ref="newHeroForm">
                <v-text-field v-model="newHero.publicName" label="Nom public" required></v-text-field>
                <v-text-field v-model="newHero.realName" label="Nom réel"></v-text-field>
                <div v-for="(power, index) in newHero.powers" :key="index" class="mb-4">
                  <v-row>
                    <v-col cols="5">
                      <v-text-field v-model="power.name" label="Nom du pouvoir"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-select v-model="power.type" :items="powerTypes" label="Type"></v-select>
                    </v-col>
                    <v-col cols="3">
                      <v-slider v-model="power.level" min="0" max="100" label="Niveau"></v-slider>
                    </v-col>
                    <v-col cols="1">
                      <v-btn icon @click="removePower(index)">
                        <v-icon color="error">mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
                <v-btn @click="addPower">Ajouter un pouvoir</v-btn>
              </v-form>
            </v-card-text>
          </v-tab-item>
        </v-tabs-items>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isAddMemberDialogOpen = false">Annuler</v-btn>
          <v-btn
              color="primary"
              @click="addNewMember"
              v-if="addMemberTab === 1"
              :disabled="!newHero.publicName"
          >
            Créer et ajouter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isConfirmDeleteOpen" max-width="400">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir retirer ce membre de l'équipe ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isConfirmDeleteOpen = false">Annuler</v-btn>
          <v-btn color="error" @click="removeMember(heroToRemove)">Confirmer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isEditDialogOpen" max-width="800" persistent>
      <v-card>
        <v-card-title>Modifier {{ editedHero.publicName }}</v-card-title>
        <v-card-text>
          <v-form ref="editForm">
            <v-text-field
                v-model="editedHero.publicName"
                label="Nom public"
                :rules="[v => !!v || 'Champ requis']"
                required
            ></v-text-field>

            <v-text-field
                v-model="editedHero.realName"
                label="Nom réel"
            ></v-text-field>

            <v-subheader class="pl-0">Pouvoirs</v-subheader>

            <div v-for="(power, index) in editedHero.powers" :key="power._id || index" class="mb-4">
              <v-row align="center">
                <v-col cols="5">
                  <v-text-field
                      v-model="power.name"
                      label="Nom du pouvoir"
                      :rules="[v => !!v || 'Champ requis']"
                  ></v-text-field>
                </v-col>

                <v-col cols="3">
                  <v-select
                      v-model="power.type"
                      :items="powerTypes"
                      label="Type"
                      item-text="text"
                      item-value="value"
                      :rules="[v => !!v || 'Champ requis']"
                  ></v-select>
                </v-col>

                <v-col cols="3">
                  <v-slider
                      v-model="power.level"
                      min="0"
                      max="100"
                      thumb-label
                      label="Niveau"
                  ></v-slider>
                  <div class="text-center">{{ power.level }}</div>
                </v-col>

                <v-col cols="1">
                  <v-btn icon @click="removeEditedPower(index)">
                    <v-icon color="error">mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <v-btn @click="addEditedPower" color="secondary" class="mb-4">
              <v-icon left>mdi-plus</v-icon>
              Ajouter un pouvoir
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isEditDialogOpen = false">Annuler</v-btn>
          <v-btn
              color="primary"
              @click="updateHero"
              :loading="isUpdating"
          >
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </div>
</template>
<script>
import {mapActions, mapMutations, mapState} from "vuex";
export default {
  name: 'ItemsList',
  data() {
    return {
      loading: false,
      isUpdating: false,
      isAddMemberDialogOpen: false,
      isEditDialogOpen: false,
      isConfirmDeleteOpen: false,
      addMemberTab: 0,
      heroToRemove: null,
      editedHero: {},
      newHero: {
        publicName: '',
        realName: '',
        powers: []
      },
      powerTypes: [
        { text: 'force', value: 1 },
        { text: 'vitesse', value: 2 },
        { text: 'endurance', value: 3 },
        { text: 'magie', value: 4 },
        { text: 'effrayant', value: 5 },
        { text: 'furtivité', value: 6 },
        { text: 'stupidité', value: 7 }
      ],
      heroHeaders: [
        { text: 'Nom public', value: 'publicName' },
        { text: 'Nom réel', value: 'realName' },
        { text: 'Pouvoirs', value: 'powers', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      availableHeroHeaders: [
        { text: 'Nom public', value: 'publicName' },
        { text: 'Nom réel', value: 'realName' }
      ]
    }
  },
  methods: {
    ...mapMutations(['setCurrentTeam', 'clearTeamHeroes']),
    ...mapActions(['getHeroes', 'getHeroesById', 'removeHeroesFromTeam','addHeroesToTeam','postHeroes','updateHeroes']),
    async loadHeroes() {
      this.loading = true;
      this.clearTeamHeroes()
      try {
        // Charge d'abord tous les héros
        await this.getHeroes();

        // Charge les détails pour chaque membre de l'équipe
        console.log(this.currentTeam)
        for (const _id of this.currentTeam.members) {
          await this.getHeroesById(_id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des héros:", error);
      } finally {
        this.loading = false;
      }
    },

    async removeMember(idHero) {
      idHero = [idHero]
      await this.removeHeroesFromTeam(idHero)
      await this.clearTeamHeroes()
      await this.loadHeroes()
      this.isConfirmDeleteOpen = false;
    },
    addPower() {
      this.newHero.powers.push({
        name: '',
        type: 1,
        level: 50
      });
    },
    removePower(index) {
      this.newHero.powers.splice(index, 1);
    },
    addExistingMember(hero) {
      console.log(hero._id)
      let idHero = [hero._id]
      this.addHeroesToTeam(idHero);
      this.clearTeamHeroes()
      this.loadHeroes()
      this.isAddMemberDialogOpen = false;
    },
    async addNewMember() {
      console.log(this.newHero)
      console.log(this.newHero.realName)
      await this.postHeroes({
        publicName: this.newHero.publicName,
        realName: this.newHero.realName,
        powers: this.newHero.powers});


      let idHero = [this.currentHero._id]
      await this.addHeroesToTeam(idHero);

      this.resetNewHeroForm();
      this.isAddMemberDialogOpen = false;
      await this.loadHeroes()
    },
    resetNewHeroForm() {
      this.newHero = {
        publicName: '',
        realName: '',
        powers: []
      };
    },
    confirmRemoveMember(heroId) {
      this.heroToRemove = heroId;
      this.isConfirmDeleteOpen = true;
    },
    openEditDialog(hero) {
      this.editedHero = {
        _id: hero._id,
        publicName: hero.publicName,
        realName: hero.realName || '',
        powers: hero.powers.map(p => ({
          _id: p._id,
          name: p.name,
          type: p.type,
          level: p.level
        }))
      };
      this.isEditDialogOpen = true;
    },
    addEditedPower() {
      this.editedHero.powers.push({
        name: '',
        type: 1,
        level: 50
      });
    },
    removeEditedPower(index) {
      this.editedHero.powers.splice(index, 1);
    },

    async updateHero() {
      this.isUpdating = true
      await this.updateHeroes(this.editedHero)
      this.isEditDialogOpen = false
      await this.loadHeroes()
      this.isUpdating = false
    },
  },
  computed:{
    ...mapState(['currentTeam','heroes','teamHeroes',"currentHero"]),
    availableHeroes() {
      const memberIds = this.currentTeam.members || [];
      return this.heroes.filter(hero => !memberIds.includes(hero._id));
    }
  },

  async mounted() {
    await this.loadHeroes();
  }
}
</script>
<style scoped>

</style>