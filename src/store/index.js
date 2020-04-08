import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import { round } from '@/plugins/helper';

// Choose the default locale for momentjs.
moment.locale('es');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timeseries: null,
    lastUpdated: null,
    loaded: false,
    prediction: null,
    stats: {
      byState: {},
      maxConfirmedByState: null,
      confirmed: null,
      deaths: null,
      suspected: null,
      confirmedDelta: null
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
      // Set the timeseries data.
      state.timeseries = timeseries.map((d, i) => {
        const prevConfirmed = timeseries[i > 0 ? i - 1 : i].confirmed;
        return {
          ...d,
          date: moment(d.date),
          confirmedDelta: d.confirmed - prevConfirmed,
          growthFactor: round(d.confirmed / prevConfirmed, 4)
        };
      });
      // Growth factor by new cases.
      // state.timeseries.forEach((p, i) => {
      //   p.growthFactor =
      //     p.confirmedDelta /
      //     (i > 0 ? state.timeseries[i - 1].confirmedDelta : 1);
      // });

      const recentData = state.timeseries[state.timeseries.length - 1];

      state.stats = {
        ...state.stats,
        byState: states,
        maxConfirmedByState: Math.max(
          ...Object.values(states).map(s => s.confirmed)
        ),
        confirmed: recentData.confirmed,
        deaths: recentData.deaths,
        suspected: recentData.suspected,
        confirmedDelta: recentData.confirmedDelta
      };

      // Prediction calculation.
      const meanGrowthFactorDays = 5;
      const meanGrowthFactor = round(
        state.timeseries
          .slice(-meanGrowthFactorDays)
          .reduce((a, o) => a + o.growthFactor, 0) / meanGrowthFactorDays,
        4
      );
      state.prediction = {
        date: recentData.date.clone().add(1, 'day'),
        confirmed: round(recentData.confirmed * meanGrowthFactor, 0),
        meanGrowthFactorDays,
        meanGrowthFactor
      };

      state.lastUpdated = recentData.date
        .clone()
        .add('13', 'hour')
        .fromNow();
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
