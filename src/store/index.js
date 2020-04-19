import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import { processTimeseries } from '@/plugins/helper';

// Choose the default locale for momentjs.
moment.locale('es');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Navigation drawer.
    drawer: false,
    // Once dismissed, the disclaimer remains closed.
    disclaimerClosed: false,
    // Data for drawing the map of Mexico.
    geojson: null,
    // Contains totals about the pandemic.
    stats: null,
    // Contains info about each state.
    statsByState: null,
    // Currently selected timeseries.
    timeseries: [],
    // Most recent value of the timeseries.
    latest: {}
  },
  mutations: {
    SET_DRAWER(state, val) {
      state.drawer = val;
    },
    TOGGLE_DRAWER(state) {
      state.drawer = !state.drawer;
    },
    CLOSE_DISCLAIMER(state) {
      state.disclaimerClosed = true;
    },
    SET_GEOJSON(state, geojson) {
      state.geojson = geojson;
    },
    SET_STATS_BY_STATE(state, statsByState) {
      state.statsByState = statsByState;
    },
    SET_ACTIVE_TIMESERIES(state, { timeseries, latest }) {
      state.timeseries = timeseries;
      state.latest = latest;
    },
    SET_STATS(state, stats) {
      state.stats = stats;
    }
  },
  actions: {
    clear: ({ commit }) => {
      commit('SET_ACTIVE_TIMESERIES', { timeseries: [], latest: {} });
    },

    loadStatsByState: async ({ state, dispatch, commit }, stateKey) => {
      // Only load stats by state for the first time.
      if (!state.statsByState) {
        const statsByState = await dispatch(
          'getJSON',
          '/api/statsByState.json'
        );
        commit('SET_STATS_BY_STATE', statsByState);
      }

      // Convert data to a timeseries format. Then process it
      // to obtain the extended timeseries and latest data.
      const selectedState = state.statsByState.states[stateKey.toUpperCase()];
      let timeseries = state.statsByState.dates.map((date, i) => ({
        date,
        confirmed: selectedState.confirmed[i],
        suspected: selectedState.suspected[i],
        deaths: selectedState.deaths[i]
      }));
      const processed = processTimeseries(timeseries);
      commit('SET_ACTIVE_TIMESERIES', processed);

      return true;
    },

    loadStats: async ({ state, dispatch, commit }) => {
      // Only load geojson for the first time.
      if (!state.geojson) {
        const geojson = await dispatch('getJSON', '/maps/mexico.json');
        commit('SET_GEOJSON', geojson);
      }

      // Only load stats for the first time.
      if (!state.stats) {
        const stats = await dispatch('getJSON', '/api/stats.json');
        commit('SET_STATS', stats);
      }

      // Process the timeseries data.
      const processed = processTimeseries(state.stats.timeseries);
      commit('SET_ACTIVE_TIMESERIES', processed);

      return true;
    },

    getJSON: async (_, url) =>
      new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.statusText);
          }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
      })
  },
  modules: {}
});
