import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user-info'))
  },
  mutations: {
    changeUser (state, data) {
      Object.assign(state.user, data)
      // 然后存储到本地
      window.localStorage.setItem('user-info', JSON.stringify(state.user))
    }
  }
})
// 导出store
export default store
