<template>
  <v-container>
    <v-row class="py-5">
      <v-col cols="12">
        <v-card flat color="transparent">
          <v-card-title class="pa-0">
            <div class="display-2">México</div>
            <v-spacer></v-spacer>
            <download-stats />
          </v-card-title>
          <v-card-text class="pa-0">
            Última actualización:
            {{ lastUpdated || 'cargando...' }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <disclaimer />
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <value-card title="Confirmados" color="red" :value="stats.confirmed" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <value-card
          title="Confirmados Hoy"
          :color="confirmedDeltaColor"
          :value="stats.confirmedDelta"
        >
          <template v-slot:default="{ value }">+{{ value }}</template>
        </value-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <value-card
          title="Sospechosos"
          color="orange"
          :value="stats.suspected"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <value-card title="Fallecidos" color="blueGrey" :value="stats.deaths" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <map-card />
      </v-col>
      <v-col cols="12" md="6">
        <total-cases-chart />
      </v-col>
      <v-col cols="12" md="6">
        <cases-by-state-table />
      </v-col>
      <v-col cols="12" md="6">
        <daily-increase-chart />
      </v-col>
      <v-col cols="12" md="12">
        <growth-factor-chart />
      </v-col>
      <v-col cols="12">
        <Faq />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ValueCard from '@/components/ValueCard';
import MapCard from '@/components/charts/MapChart';
import TotalCasesChart from '@/components/charts/TotalCasesChart';
import DailyIncreaseChart from '@/components/charts/DailyIncreaseChart';
import Disclaimer from '@/components/Disclaimer';
import CasesByStateTable from '@/components/tables/CasesByStateTable';
import GrowthFactorChart from '@/components/charts/GrowthFactorChart';
import Faq from '@/components/faq';
import DownloadStats from '@/components/DownloadStats';
import { mapState } from 'vuex';

export default {
  name: 'Home',
  components: {
    Faq,
    ValueCard,
    MapCard,
    TotalCasesChart,
    Disclaimer,
    CasesByStateTable,
    DailyIncreaseChart,
    DownloadStats,
    GrowthFactorChart
  },
  computed: {
    ...mapState({
      // Data for sparklines.
      // suspected: state => ({
      //   dataPoints: state.timeseries
      //     ? state.timeseries.map(s => s.suspected)
      //     : []
      // }),
      // confirmed: state => ({
      //   dataPoints: state.timeseries
      //     ? state.timeseries.map(s => s.confirmed)
      //     : []
      // }),
      // confirmedDelta: state => ({
      //   dataPoints: state.timeseries
      //     ? state.timeseries
      //         .slice(1)
      //         .map((s, i) => s.confirmed - state.timeseries[i].confirmed)
      //     : []
      // }),
      // deaths: state => ({
      //   dataPoints: state.timeseries ? state.timeseries.map(s => s.deaths) : []
      // }),
      lastUpdated: state => state.lastUpdated,
      stats: state => state.stats,
      confirmedDeltaColor: state => {
        if (state.stats.confirmedDelta > 0) return 'red';
        if (state.stats.confirmedDelta < 0) return 'green';
        return 'blueGrey';
      }
    })
  }
};
</script>
