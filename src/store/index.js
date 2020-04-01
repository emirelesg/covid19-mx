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
    SET_STATS(state, { timeseries, states }) {
      // Set the stats object.
      const sortedStates = Object.entries(states).sort(
        (a, b) => a[1].confirmed - b[1].confirmed
      );
      const lastTimeseries = timeseries.slice(-1)[0];
      const prevTimeseries = timeseries.slice(-2)[0];

      state.stats = {
        ...state.stats,
        byState: states,
        maxConfirmedByState: sortedStates[sortedStates.length - 1][1].confirmed,
        confirmed: sortedStates.map(([, data]) => data.confirmed).reduce(add),
        deaths: sortedStates.map(([, data]) => data.deaths).reduce(add),
        suspected: lastTimeseries.suspected,
        confirmedDelta: lastTimeseries.confirmed - prevTimeseries.confirmed,
        loaded: true
      };

      // Set the timeseries data.
      state.timeseries = timeseries;
      state.timeseries.forEach(t => (t.date = moment(t.date)));
      state.lastUpdated = moment(lastTimeseries.date).format('LL');
    }
  },
  actions: {
    loadData: async ({ dispatch, commit }) => {
      const [geojson, stats] = await Promise.all([
        dispatch('getJSON', '/maps/mexico.json'),
        dispatch('getJSON', '/api/stats.json')
      ]);
      commit('SET_GEOJSON', geojson);
      commit('SET_STATS', stats);
      commit('SET_LOADED', true);
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
