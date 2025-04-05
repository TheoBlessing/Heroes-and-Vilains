import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ListeOrganisation from "@/views/ListeOrganisation.vue";
import store from "@/store";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    meta: { accessLevel: 0},
    component:()=> import("../App.vue"),
    children: [
      {
        path:'organisation',
        component:ListeOrganisation,
        meta: { accessLevel: 0},
      },
      {
        path: '',
        component: HomeView,
        meta: { accessLevel: 0},
      },
      {
        path:'auth',
        component:()=>import('../views/SecretView.vue'),
        meta: { accessLevel: 0},
      },
      {
        path:'detail',
        component: ()=>import('../views/DetailOrganisationView.vue'),
        meta: { accessLevel: 1},
      },
      {
        path: 'teams',
        component: ()=>import('../views/TeamList.vue'),
        meta: { accessLevel: 0},
      },
      {
        path: 'team/',
        component: () => import('../views/DetailTeam.vue'),
        meta: { accessLevel: 1},
      },


    ]
  },
  {
    path: '*',
    name: 'error404',
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function checkAccess(to) {
  console.log("login?  : "+store.getters["auth/isLoggedIn"])
  if ((to.meta.accessLevel) && (to.meta.accessLevel  === 1) && (store.state.auth.login === false)) {
    console.log('test')
    return false
  }
  return true
}
router.beforeEach((to, from, next) => {

  if (to.name === 'error404') {
    store.commit('errors/pushError', 'Invalid route')
    next('/')
  }
  else if (checkAccess(to)) {
    next()
  }
  else {
    store.commit('errors/pushError', 'Authentification requise - Veuillez saisir la phrase secrète')
    next('/auth')
  }
});


export default router
