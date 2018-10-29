import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      singlePoetry: [], // signle poetry default data
      recommendPoetry: [] // recommend poetry default data
    },
    actions,
    mutations,
    getters
  })
}
