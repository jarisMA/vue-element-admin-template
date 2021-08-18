import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: null,
    authPermissions: [],
  },
  mutations: {
    setAuthPermissions(state, authPermissions) {
      state.authPermissions = authPermissions;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  actions: {},
  modules: {},
});
