import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

// Choose the default locale for momentjs.
moment.locale('es');

const add = (a, o) => a + o;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timeseries: null,
    lastUpdated: null,
    loaded: false,
    stats: {
      byState: {},
      maxConfirmedByState: null,
      confirmed: null,
      recovered: null,
      deaths: null,
      suspected: null,
      confirmedDelta: null,
      loaded: false
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

      state.stats = {
        ...state.stats,
        byState: states,
        maxConfirmedByState: sortedStates[sortedStates.length - 1][1].confirmed,
        confirmed: sortedStates.map(([, data]) => data.confirmed).reduce(add),
        recovered: sortedStates.map(([, data]) => data.recovered).reduce(add),
        deaths: sortedStates.map(([, data]) => data.deaths).reduce(add),
        suspected: suspected,
        confirmedDelta:
          timeseries.slice(-1)[0].confirmed - timeseries.slice(-2)[0].confirmed,
        loaded: true
      };

      // Set the timeseries data.
      state.timeseries = timeseries;
      state.timeseries.forEach(t => (t.date = moment(t.date)));
      state.lastUpdated = moment(timeseries.slice(-1)[0].date).format('LL');
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
