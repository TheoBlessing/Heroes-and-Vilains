export default {
    namespaced: true,
    state:()=> ({
        orgSecret: null,
        login: false
    }),
    getters: {
        isLoggedIn(state) {
            return state.login
        }
    },

    mutations: {
        SetOrgSecret(state, secret) {
            state.orgSecret = secret
        },
        SetLogin(state,login){
            state.login = login
        },
        ClearOrgSecret(state) {
            state.orgSecret = null
        }
    },

    actions : {
        setSecret({ commit }, secret) {
            commit('SetOrgSecret', secret)
            commit('SetLogin',true)
        },
        clearSecret({ commit }) {
            commit('ClearOrgSecret')
        }
    },
}