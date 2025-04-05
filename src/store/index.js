import Vue from 'vue'
import Vuex from 'vuex'
import auth from './secret'
import errors from "./errors";
import {getHeroesByIdFromAPI, getAliasesFromAPI, postHeroesService, updateHeroesService} from "@/services/hero.service"
import {
  getAllOrgsService,
  createOrgService,
  getOrgByIdService,
  addTeamToOrgService,
  removeteamFromOrgService
} from '@/services/org.service'
import {getAllTeamsService,createTeamService,removeHeroesFromTeamService,addHeroesToTeamService} from '@/services/team.service'
Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    currentHero:[],
    currentTeam:null,
    currentOrg:null,
    teamHeroes:[],
    heroes:[],
    teams:[],
    orgs:[]

  },
  getters: {
  },
  mutations: {
    setCurrentHero(state, hero) {
      state.currentHero = hero
    },
    setCurrentTeam(state, team) {
      state.currentTeam = team
    },
    setCurrentOrg(state, org) {
      state.currentOrg = org
    },
    setHeroes(state, heroes) {
      state.heroes.splice(0)
      heroes.forEach(h => state.heroes.push(h))
    },
    setTeams(state, teams) {
      state.teams.splice(0)
      teams.forEach(t => state.teams.push(t))
    },
    setOrgs(state, orgs){
      state.orgs.splice(0)
      orgs.forEach(o => state.orgs.push(o))
    },
    addTeamHeroes(state, heroes){
      state.teamHeroes.push(...heroes)
    },
    clearTeamHeroes(state){
      state.teamHeroes = []
    }
  },
  actions: {
    async getHeroes({commit}) {
      console.log("STORE: get all heroes")
      let result = null
      try {

        result = await getAliasesFromAPI()
        if (result.error === 0) {
          commit('setHeroes',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans getHeroes()")
      }
    },
    async getHeroesById({commit}, id) {
      let result = null
      try {
        result = await getHeroesByIdFromAPI(id)
        if (result.error === 0) {
          commit('addTeamHeroes',result.data)

        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans getHeroesByID()")
      }
    },
    async postHeroes({commit}, {publicName, realName, powers = []}) {
      let result = null
      console.log(publicName+realName+powers)
      console.log(realName)

      try {
        result = await postHeroesService(publicName,realName,powers)
        if (result.error === 0) {
          commit('setCurrentHero',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans postHeroes()")
        console.log(result.data)
      }
    },
    async updateHeroes({commit}, heroData) {
      let result = null
      try {
        result = await updateHeroesService(heroData)
        if (result.error === 0) {
          commit('setCurrentHero',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans updateHeroes()")
      }
    },
    async getHeroesByID({commit},_id,valeurSecret) {
      let result = null
      try {
        result = await getHeroesByIdFromAPI(_id,valeurSecret)
        if (result.error === 0) {
          commit('setCurrentHero',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans updateHeroes()")
      }
    },
    async getOrganisation({commit}) {
      console.log("STORE: get all org")
      let result = null
      try {

        result = await getAllOrgsService()
        if (result.error === 0) {
          console.log(result.data)
          commit('setOrgs',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans getOrganisation()")
      }
    },
    async createOrganisation({commit},organisation) {
      let result = null
      console.log(organisation)
      let nom = organisation.nom
      let valeurSecrete = organisation.valeurSecrete
      try {
        console.log("val : "+valeurSecrete+" nom : "+nom)
        result = await createOrgService(nom,valeurSecrete)
        if (result.error === 0) {
          console.log(result.data)
          commit('setCurrentOrg',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans createOrgService()")
      }
    },
    async getOrganisationById({state,commit}) {
      let id = state.currentOrg._id
      let result = null
      try {
        result = await getOrgByIdService(id)
        if (result.error === 0) {
          commit('setCurrentOrg',result.data[0])
        }
        else {
          commit('setCurrentOrg',null)
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans getOrganisationById()")
      }
    },
    async addTeamsToOrg({commit},id) {
      let result = null
      try {
        result = await addTeamToOrgService(id)
        if (result.error === 0) {
          commit('setCurrentTeam',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans getTeams()")
      }
    },
    async getTeams({commit}) {
      let result = null
      try {
        result = await getAllTeamsService()
        if (result.error === 0) {
          console.log(result.data)
          commit('setTeams',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans getTeams()")
      }
    },
    async createTeam({commit},name) {
      let result = null
      try {
        result = await createTeamService(name)
        if (result.error === 0) {
          console.log(result.data)
          commit('setCurrentTeam',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans createTeam()")
      }
    },
    async removeHeroesFromTeam({commit,state},idHeroes) {
      let result = null
      console.log(state.currentTeam)
      try {
        console.log("surrentteam : "+state.currentTeam)
        result = await removeHeroesFromTeamService(idHeroes,state.currentTeam._id)
        if (result.error === 0) {
          console.log(result.data)
          commit('setCurrentTeam',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans removeHeroesFromTeam()")
      }
    },
    async addHeroesToTeam({commit,state},idHeroes) {
      let result = null
      console.log(state.currentTeam)
      try {
        result = await addHeroesToTeamService(idHeroes,state.currentTeam._id)
        if (result.error === 0) {
          console.log(result.data)
          commit('setCurrentTeam',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans addHeroesToTeam()")
      }
    },
    async removeTeamFromOrg({commit},idTeam) {
      let result = null
      try {
        result = await removeteamFromOrgService(idTeam)
        if (result.error === 0) {
          commit('setCurrentOrg',result.data)
        }
        else {
          console.log(result.data)
        }
      }
      catch(err) {
        console.log("Cas anormal dans removeTeamFromOrg()")
      }
    },


  },

  modules: {
    auth,
    errors
  }
})
