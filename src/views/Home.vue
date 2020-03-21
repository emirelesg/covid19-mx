<template>
  <v-container>
    <v-row>
      <v-col sm="12">
        <v-card flat color="transparent">
          <v-card-title class="pa-0">
            <div class="headline">México</div>
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
        ></value-card>
      </v-col>
      <v-col sm="6" md="3">
        <value-card
          title="Sospechosos"
          color="orange"
          v-bind:value="stats.suspected"
        ></value-card>
      </v-col>
      <v-col sm="6" md="3">
        <value-card
          title="Recuperados"
          color="green"
          v-bind:value="stats.recovered"
        ></value-card>
      </v-col>
      <v-col sm="6" md="3">
        <value-card
          title="Fallecimientos"
          color="blueGrey"
          shade="darken2"
          v-bind:value="stats.deceased"
        ></value-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12">
        <map-card></map-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ValueCard from '@/components/ValueCard.vue';
import MapCard from '@/components/MapCard.vue';
import { mapState } from 'vuex';

export default {
  name: 'Home',
  components: {
    ValueCard,
    MapCard
  },
  computed: {
    ...mapState({
      lastUpdated: state => state.lastUpdated,
      stats: state => state.stats
    })
  }
};
</script>
