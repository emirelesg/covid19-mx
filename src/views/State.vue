<template>
  <v-container>
    <v-row class="py-5">
      <v-col cols="12">
        <v-card flat color="transparent">
          <v-card-title class="pa-0">
            <div class="display-2">{{ stateName }}</div>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text class="pa-0">
            Última actualización:
            {{ loaded ? latest.updateDate : 'cargando...' }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <disclaimer />
    <latest-values :loaded="loaded" />
    <!-- <update-alert /> -->
    <v-row>
      <v-col cols="12" md="6">
        <total-cases-chart :loaded="loaded" />
      </v-col>
      <v-col cols="12" md="6">
        <daily-increase-chart :loaded="loaded" />
      </v-col>
      <v-col cols="12">
        <start-of-symptoms :loaded="loaded" />
      </v-col>
      <v-col cols="12">
        <growth-factor-chart :loaded="loaded" />
      </v-col>
      <v-col cols="12">
        <donations />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DailyIncreaseChart from '@/components/charts/DailyIncreaseChart';
import GrowthFactorChart from '@/components/charts/GrowthFactorChart';
import TotalCasesChart from '@/components/charts/TotalCasesChart';
import StartOfSymptoms from '@/components/charts/StartOfSymptomsChart';
import Disclaimer from '@/components/Disclaimer';
// import UpdateAlert from '@/components/UpdateAlert';
import LatestValues from '@/components/LatestValues';
import { stateNames } from '@/plugins/helper';
import Donations from '@/components/Donations';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'State',
  components: {
    Disclaimer,
    StartOfSymptoms,
    Donations,
    LatestValues,
    TotalCasesChart,
    GrowthFactorChart,
    // UpdateAlert,
    DailyIncreaseChart
  },
  data() {
    return {
      loaded: false,
      stateName: null
    };
  },
  methods: {
    ...mapActions(['loadStatsByState', 'clear', 'selectState']),
    async init() {
      this.loaded = false;

      const stateKey = this.$route.params.stateKey.toLowerCase();
      this.stateName = stateNames[stateKey];
      if (this.stateName === 'México') this.stateName = `Estado de México`;

      this.clear();
      this.loaded = await this.loadStatsByState(stateKey);
    }
  },
  created() {
    this.init();
  },
  watch: {
    '$route.params.stateKey': function() {
      if (stateNames[this.$route.params.stateKey.toLowerCase()]) {
        this.init();
      } else {
        this.$router.push({ name: 'NotFound' });
      }
    }
  },
  computed: {
    ...mapState({
      latest: state => state.latest,
      timeseries: state => state.timeseries
    })
  }
};
</script>
