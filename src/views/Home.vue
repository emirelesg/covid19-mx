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
        <map-card :loaded="loaded" />
      </v-col>
      <v-col cols="12" md="6">
        <total-cases-chart :loaded="loaded" />
      </v-col>
      <v-col cols="12" md="6">
        <start-of-symptoms :loaded="loaded" />
      </v-col>
      <v-col cols="12" md="6">
        <daily-increase-chart :loaded="loaded" />
      </v-col>
      <v-col cols="12">
        <cases-by-state-table :loaded="loaded" />
      </v-col>
      <v-col cols="12" md="6">
        <symptoms-evolution-chart :loaded="loaded" />
      </v-col>
      <v-col cols="12" md="6">
        <growth-factor-chart :skip="50" :loaded="loaded" />
      </v-col>
      <v-col cols="12">
        <Faq />
      </v-col>
      <v-col cols="12">
        <Donations />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MapCard from '@/components/charts/MapChart';
import TotalCasesChart from '@/components/charts/TotalCasesChart';
import DailyIncreaseChart from '@/components/charts/DailyIncreaseChart';
import StartOfSymptoms from '@/components/charts/StartOfSymptomsChart';
import Disclaimer from '@/components/Disclaimer';
import CasesByStateTable from '@/components/tables/CasesByStateTable';
import GrowthFactorChart from '@/components/charts/GrowthFactorChart';
import SymptomsEvolutionChart from '@/components/charts/SymptomsEvolutionChart';
import Faq from '@/components/Faq';
import DownloadStats from '@/components/DownloadStats';
import LatestValues from '@/components/LatestValues';
import Donations from '@/components/Donations';
// import UpdateAlert from '@/components/UpdateAlert';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Home',
  components: {
    Faq,
    MapCard,
    // UpdateAlert,
    LatestValues,
    TotalCasesChart,
    StartOfSymptoms,
    SymptomsEvolutionChart,
    Disclaimer,
    CasesByStateTable,
    DailyIncreaseChart,
    DownloadStats,
    GrowthFactorChart,
    Donations
  },
  data() {
    return {
      loaded: false
    };
  },
  methods: {
    ...mapActions(['loadStats', 'clear'])
  },
  async mounted() {
    this.clear();
    this.loaded = await this.loadStats();
  },
  computed: {
    ...mapState({
      latest: state => state.latest
    })
  }
};
</script>
