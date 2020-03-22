<template>
  <v-container>
    <v-row class="py-5">
      <v-col sm="12">
        <v-card flat color="transparent">
          <v-card-title class="pa-0">
            <div class="display-2">México</div>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text class="pa-0">Última actualización: {{ lastUpdated }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="6" md="3">
        <value-card
          title="Confirmados"
          color="red"
          v-bind:value="stats.confirmed"
        />
      </v-col>
      <v-col sm="6" md="3">
        <value-card
          title="Sospechosos"
          color="orange"
          v-bind:value="stats.suspected"
        />
      </v-col>
      <v-col sm="6" md="3">
        <value-card
          title="Recuperados"
          color="green"
          v-bind:value="stats.recovered"
        />
      </v-col>
      <v-col sm="6" md="3">
        <value-card
          title="Fallecidos"
          color="blueGrey"
          shade="darken3"
          v-bind:value="stats.deaths"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12" md="6">
        <map-card/>
      </v-col>
      <v-col sm="12" md="6">
        <total-cases-chart/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ValueCard from '@/components/ValueCard.vue';
import MapCard from '@/components/MapCard.vue';
import TotalCasesChart from '@/components/charts/TotalCasesChart.vue';
import { mapState } from 'vuex';

export default {
  name: 'Home',
  components: {
    ValueCard,
    MapCard,
    TotalCasesChart
  },
  computed: {
    ...mapState({
      lastUpdated: state => state.lastUpdated,
      stats: state => state.stats
    })
  }
};
</script>
