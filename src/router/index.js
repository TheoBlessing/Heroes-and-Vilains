import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ListeOrganisation from "@/views/ListeOrganisation.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component:()=> import("../App.vue"),
    children: [
      {
        path:'organisation',
        component:ListeOrganisation
      },
      {
        path: '',
        component: HomeView
      },
      {
        path:'auth',
        component:()=>import('../views/SecretView.vue')
      },
      {
        path:'detail',
        component: ()=>import('../views/DetailOrganisationView.vue')
      },
      {
        path: 'teams',
        component: ()=>import('../views/TeamList.vue')
      },
      {
        path: 'team/',
        component: () => import('../views/DetailTeam.vue'),
      },
      {
        path: 'team/add-member',
        component:()=>import('../components/AddMember.vue')
      }


    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
