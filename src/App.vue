<template>
  <div>
    <v-app>
      <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Mon Application</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="handleclick">
          S'authentifier
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" app temporary>
        <v-list>
          <v-list-item v-for="(item, index) in menuItems" :key="index" :to="item.route">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="main-content">
        <v-container fluid class="pa-0">
          <router-view></router-view>
        </v-container>
      </v-main>
      <error-dialog title="Erreur" width="500"></error-dialog>
    </v-app>


  </div>
</template>

<script>

import router from "@/router";
import ErrorDialog from "@/components/ErrorDialog.vue";

export default {
  name: 'App',
  components:{ErrorDialog },
  data: () => ({
    drawer: false, // Contrôle l'état du menu tiroir (ouvert/fermé)
    menuItems: [
      {title: 'Accueil',route: '/'},
      {title: 'Authentification',route: 'auth'},
      {title: 'Liste des organisation', route: 'organisation'},
      {title: 'Liste des équipes', route: 'teams'},
    ],
  }),
  methods:{
    handleclick(){
      router.push('auth')
    }
  }
};
</script>

<style scoped>
.main-content {
  margin-top: -90px;
}
</style>



