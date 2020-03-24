import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

// import { states, suspected } from '@/assets/MexicoCases.json';
// // 2d array with all states. Sorted by least to most cases.

const add = (a, o) => a + o;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timeseries: null,
    lastUpdated: null,
    loaded: false,
    stats: {
      loaded: false,
      byState: {},
      maxConfirmedByState: null,
      confirmed: null,
      recovered: null,
      deaths: null,
      suspected: null
    },
    geojson: null
  },
  mutations: {
    SET_LOADED(state, loaded) {
      state.loaded = loaded;
    },
    SET_GEOJSON(state, geojson) {
      state.geojson = geojson;
    },
    SET_STATS(state, { timeseries, states, suspected }) {
      // Set the stats object.
      const sortedStates = Object.entries(states).sort(
        (a, b) => a[1].confirmed - b[1].confirmed
      );
      state.stats.byState = states;
      state.stats.maxConfirmedByState =
        sortedStates[sortedStates.length - 1][1].confirmed;
      state.stats.confirmed = sortedStates
        .map(([, data]) => data.confirmed)
        .reduce(add);
      state.stats.recovered = sortedStates
        .map(([, data]) => data.recovered)
        .reduce(add);
      state.stats.deaths = sortedStates
        .map(([, data]) => data.deaths)
        .reduce(add);
      state.stats.suspected = suspected;

      // Set the timeseries data.
      state.timeseries = timeseries;
      state.timeseries.forEach(t => (t.date = moment(t.date)));
      state.lastUpdated = moment(timeseries[timeseries.length - 1].date).format(
        'LL'
      );

      // All stats loaded.
      state.stats.loaded = true;
    }
  },
  actions: {
    loadData: async ({ commit }) => {
      const geojson = await import(
        /* webpackChunkName: "geojson" */ '@/assets/MexicoGeoJson.json'
      );
      commit('SET_GEOJSON', geojson);
      const stats = await import(
        /* webpackChunkName: "stats" */ '@/assets/MexicoStats.json'
      );
      commit('SET_STATS', stats);
      commit('SET_LOADED', true);
    }
  },
  modules: {}
});
