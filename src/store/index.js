import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import {
  processTimeseries,
  processTimeseriesBySymptoms,
  processStatsBySymptoms,
  modes,
  round,
  isDateExpired,
  statePopulation
} from '@/plugins/helper';

// Choose the default locale for momentjs.
moment.locale('es');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Urls for source data.
    statsUrl: '/api/stats.json',
    statsByStateUrl: '/api/statsByState.json',
    statsBySymptomsUrl: '/api/statsBySymptoms.json',
    geojsonUrl: '/maps/mexico.json',
    // What property is used to display charts.
    mode: modes[0],
    modeIdx: 0,
    // Navigation drawer.
    drawer: false,
    // Used for saving the state of closed alerts.
    disclaimerClosed: false,
    updateAlertClosed: false,
    // Data for drawing the map of Mexico.
    geojson: null,
    // Contains totals about the pandemic.
    stats: null,
    // Contains info about each state.
    statsByState: null,
    // Contains timeseries data about the changes in start of symptoms.
    statsBySymptoms: null,
    // Currently selected timeseries.
    timeseries: [],
    // Currently selected timeseries of cases by date of start of symptoms.
    timeseriesBySymptoms: [],
    // Most recent value of the timeseries.
    latest: {}
  },
  mutations: {
    SET_MODE_BY_IDX(state, idx) {
      state.modeIdx = idx;
      state.mode = modes[idx];
    },
    SET_DRAWER(state, val) {
      state.drawer = val;
    },
    TOGGLE_DRAWER(state) {
      state.drawer = !state.drawer;
    },
    CLOSE_UPDATE_ALERT(state) {
      state.updateAlertClosed = true;
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
    SET_STATS_BY_SYMPTOMS(state, statsBySymptoms) {
      state.statsBySymptoms = statsBySymptoms;
    },
    SET_ACTIVE(state, { timeseries, timeseriesBySymptoms, latest }) {
      state.timeseries = timeseries;
      state.latest = latest;
      state.timeseriesBySymptoms = timeseriesBySymptoms;
    },
    SET_STATS(state, stats) {
      state.stats = stats;
    }
  },
  actions: {
    clear: ({ commit }) => {
      commit('SET_ACTIVE', {
        timeseries: [],
        timeseriesBySymptoms: [],
        latest: {}
      });
    },

    loadStatsBySymptoms: async ({ state, dispatch, commit }) => {
      if (
        !state.statsBySymptoms ||
        isDateExpired(state.statsBySymptoms.dates.slice(-1)[0])
      ) {
        const statsBySymptoms = await dispatch(
          'getJSON',
          state.statsBySymptomsUrl
        );
        const processed = processStatsBySymptoms(statsBySymptoms);
        commit('SET_STATS_BY_SYMPTOMS', processed);
      }
      return true;
    },

    loadStatsByState: async ({ state, dispatch, commit }, stateKey) => {
      // Only load stats by state for the first time or if data is expired.
      if (
        !state.statsByState ||
        isDateExpired(state.statsByState.dates.slice(-1)[0])
      ) {
        const statsByState = await dispatch('getJSON', state.statsByStateUrl);
        commit('SET_STATS_BY_STATE', statsByState);
      }

      // Convert data to a timeseries format. Then process it
      // to obtain the extended timeseries and latest data.
      const selectedState = state.statsByState.states[stateKey];
      const { timeseries, latest } = processTimeseries(
        state.statsByState.dates.map((date, i) => ({
          date,
          confirmed: selectedState.confirmed[i],
          suspected: selectedState.suspected[i],
          deaths: selectedState.deaths[i],
          active: selectedState.active[i],
          tests: selectedState.tests[i]
        }))
      );

      // Set the timeseries for cases by start of symptoms.
      const timeseriesBySymptoms = processTimeseriesBySymptoms(
        state.statsByState.datesBySymptoms.map((date, i) => ({
          date,
          cases: selectedState.bySymptoms[i]
        }))
      );

      commit('SET_ACTIVE', {
        timeseries,
        timeseriesBySymptoms,
        latest
      });

      return true;
    },

    loadStats: async ({ state, dispatch, commit }) => {
      // Only load geojson for the first time.
      if (!state.geojson) {
        const geojson = await dispatch('getJSON', state.geojsonUrl);
        commit('SET_GEOJSON', geojson);
      }

      // Only load stats for the first time.
      if (
        !state.stats ||
        isDateExpired(state.stats.timeseries.slice(-1)[0].date)
      ) {
        const stats = await dispatch('getJSON', state.statsUrl);
        stats.statesAsArray = stats.statesAsArray.map(obj => ({
          ...obj,
          testsRatio: round((obj.tests * 10000) / statePopulation[obj.key], 1)
        }));
        commit('SET_STATS', stats);
      }

      // Process the timeseries data.
      const { timeseries, latest } = processTimeseries(state.stats.timeseries);

      // Set the timeseries for cases by start of symptoms.
      const timeseriesBySymptoms = processTimeseriesBySymptoms(
        state.stats.timeseriesBySymptoms
      );

      commit('SET_ACTIVE', {
        timeseries,
        timeseriesBySymptoms,
        latest
      });

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
