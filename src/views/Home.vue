<template>
  <v-container>
    <v-row class="py-5">
      <v-col cols="12">
        <v-card flat color="transparent">
          <v-card-title class="pa-0">
            <div class="display-2">México</div>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text
            class="pa-0"
          >Última actualización: {{ lastUpdated || 'cargando...' }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <disclaimer/>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <value-card
          title="Confirmados"
          color="red"
          v-bind:value="stats.confirmed"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <value-card
          title="Sospechosos"
          color="orange"
          v-bind:value="stats.suspected"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <value-card
          title="Recuperados"
          color="green"
          :updatedOn="confirmedLastUpdated"
          v-bind:value="stats.recovered"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <value-card
          title="Fallecidos"
          color="blueGrey"
          shade="darken3"
          v-bind:value="stats.deaths"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <map-card/>
      </v-col>
      <v-col cols="12" md="6">
        <total-cases-chart/>
      </v-col>
      <v-col cols="12" md="6">
        <cases-by-state-table/>
      </v-col>
      <v-col cols="12" md="6">
        <daily-increase-chart/>
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
// import Share from '@/components/Share.vue';
import { mapState } from 'vuex';

export default {
  name: 'Home',
  components: {
    ValueCard,
    // Share,
    MapCard,
    TotalCasesChart,
    Disclaimer,
    CasesByStateTable,
    DailyIncreaseChart
  },
  computed: {
    ...mapState({
      confirmedLastUpdated: state => state.stats.confirmedLastUpdated,
      lastUpdated: state => state.lastUpdated,
      stats: state => state.stats
    })
  }
};
</script>
