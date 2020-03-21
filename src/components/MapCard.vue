<template>
  <v-card outlined>
    <v-card-title>Mapa</v-card-title>
    <v-card-text>
      <svg width="600" height="600"></svg>
    </v-card-text>
  </v-card>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'MapCard',
  data() {
    return {
      colorScale: null
    };
  },
  created() {
    this.colorScale = d3.scaleOrdinal().range(['#000', '#fff']);
  }
};
</script>
