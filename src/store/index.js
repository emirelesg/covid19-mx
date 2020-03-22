import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

import { timeseries } from '@/assets/MexicoTimeSeries.json';
import { states, suspected } from '@/assets/MexicoCases.json';

// 2d array with all states. Sorted by least to most cases.
const sortedStates = Object.entries(states).sort(
  (a, b) => a[1].confirmed - b[1].confirmed
);

// Calculate the total confirmed, recovered, and deceased cases.
const add = (a, o) => a + o;
const confirmed = sortedStates.map(([, data]) => data.confirmed).reduce(add);
const recovered = sortedStates.map(([, data]) => data.recovered).reduce(add);
const deaths = sortedStates.map(([, data]) => data.deaths).reduce(add);

// Get the key of the state with the most and least cases.
const maxConfirmedByState = sortedStates[sortedStates.length - 1][1].confirmed;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lastUpdated: moment().format('LL'),
    statsByState: states,
    stats: {
      maxConfirmedByState,
      confirmed,
      recovered,
      deaths,
      suspected
    },
    timeseries
  },
  mutations: {},
  actions: {},
  modules: {}
});
