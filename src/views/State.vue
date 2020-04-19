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
            <span v-if="loaded">
              {{ latest.updateDate }}
            </span>
            <span v-else>cargando...</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <disclaimer />
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <value-card title="Confirmados" color="red" :value="latest.confirmed" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <value-card
          title="Confirmados Hoy"
          :value="latest.confirmedDelta"
          :isDelta="true"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <value-card
          title="Sospechosos"
          color="orange"
          :value="latest.suspected"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <value-card
          title="Fallecidos"
          color="blueGrey"
          :value="latest.deaths"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <total-cases-chart :loaded="loaded" />
      </v-col>
      <v-col cols="12" md="6">
        <daily-increase-chart :loaded="loaded" />
      </v-col>
      <v-col cols="12" md="12">
        <growth-factor-chart :loaded="loaded" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DailyIncreaseChart from '@/components/charts/DailyIncreaseChart';
import GrowthFactorChart from '@/components/charts/GrowthFactorChart';
import TotalCasesChart from '@/components/charts/TotalCasesChart';
import ValueCard from '@/components/ValueCard';
import Disclaimer from '@/components/Disclaimer';
import { stateNames } from '@/plugins/helper';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'State',
  components: {
    ValueCard,
    Disclaimer,
    TotalCasesChart,
    GrowthFactorChart,
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
