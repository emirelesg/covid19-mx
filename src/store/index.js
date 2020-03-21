import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lastUpdated: moment().format('LL'),
    stats: {
      confirmed: 203,
      recovered: 3,
      deceased: 2,
      suspected: 606,
      active: 198,
      negative: 1111
    }
  },
  mutations: {},
  actions: {},
  modules: {}
});
