<template>
  <v-card outlined>
    <v-card-title class="font-weight-regular headline">Casos Confirmados</v-card-title>
    <v-card-subtitle>Mueve el cursor sobre una entidad para conocer más</v-card-subtitle>
    <v-card-text id="container">
      <v-card class="tooltip" color elevation="8" v-if="activeState">
        <v-card-title class="font-weight-regular pb-1">{{ activeState.name }}</v-card-title>
        <v-card-text>
          <div>
            <strong class="red--text">{{ activeState.confirmed }}</strong> Confirmados
          </div>
          <div>
            <strong class="green--text">{{ activeState.recovered }}</strong> Recupreados
          </div>
          <div>
            <strong
              class="blue-grey--text text--darken-3"
            >{{ activeState.deaths }}</strong> Fallecidos
          </div>
        </v-card-text>
      </v-card>
      <svg>
        <g class="map"></g>
        <g class="legend"></g>
        <g class="legendAxis"></g>
      </svg>
    </v-card-text>
  </v-card>
</template>

<script>
// Geo
// https://www.d3indepth.com/geographic/
// Mouseover
// https://bl.ocks.org/d3indepth/3ccd770923a61f26f55156657e2f51e8
// Responsive D3
// https://stackoverflow.com/questions/32029094/how-to-make-svg-100-width
// Color Scale
// https://github.com/d3/d3-scale-chromatic
// Legends
// http://bl.ocks.org/syntagmatic/e8ccca52559796be775553b467593a9f

import * as d3 from 'd3';
import geoJson from '@/assets/MexicoGeoJson.json';
import { mapState } from 'vuex';

export default {
  name: 'MapCard',
  data() {
    return {
      w: 500,
      h: 400,
      svg: null,
      activeState: null,
      tooltip: null,
      colorScale: null,
      colorScaleCases: null,
      geoGenerator: null,
      geoProjection: null
    };
  },
  mounted() {
    this.colorScale = d3.interpolateReds;
    this.colorScaleCases = cases =>
      this.colorScale(cases / this.stats.maxConfirmedByState);
    this.tooltip = d3.select('#container .tooltip');
    this.generateMap();
    this.generateLegend();
  },
  methods: {
    generateLegend() {
      const w = this.w * 0.75;
      const h = 10;
      const xAxis = (this.w - w) / 2;
      const xBar = xAxis;
      const yBar = this.h - h - 20;
      const yAxis = this.h - 20;

      // Create the a virtual gradient.
      const mainGradient = this.svg
        .append('defs')
        .append('linearGradient')
        .attr('id', 'gradient');
      for (let i = 0; i <= 1; i += 0.1) {
        mainGradient
          .append('stop')
          .attr('stop-color', this.colorScale(i))
          .attr('offset', `${i}`);
      }

      // Create the box for the legend and apply gradient.
      d3.select('#container .legend')
        .append('rect')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('width', `${w}px`)
        .attr('height', `${h}px`)
        .attr('transform', `translate(${xBar}, ${yBar})`)
        .style('fill', 'url(#gradient)');

      // Create the axis for the legend.
      const legendScale = d3
        .scaleLinear()
        .range([0, w])
        .domain([0, this.stats.maxConfirmedByState]);
      const legendAxis = d3
        .axisBottom()
        .scale(legendScale)
        .tickSize(6)
        .ticks(5);
      d3.select('#container .legendAxis')
        .attr('transform', `translate(${xAxis}, ${yAxis})`)
        .call(legendAxis);
    },

    generateMap() {
      // Select the svg and map. Make the svg responsive.
      this.svg = d3
        .select('#container svg')
        .attr('width', '100%')
        .attr('height', `${this.h}px`)
        .attr('viewBox', `0 0 ${this.w} ${this.h}`);

      const map = d3
        .select('#container .map')
        .attr('stroke', '#aaa')
        .attr('transform', `translate(0, -20)`);

      // Define the projection and generator for the map.
      this.geoProjection = d3
        .geoMercator()
        .center([-100, 22])
        .translate([this.w / 1.7, this.h / 1.7])
        .scale([this.w / 0.51]);
      this.geoGenerator = d3.geoPath().projection(this.geoProjection);

      // Join the features to path elements.
      // Create path elements and update the d attribute.
      const u = map.selectAll('path').data(geoJson.features);
      u.enter()
        .append('path')
        .attr('d', this.geoGenerator)
        .attr('id', d => `${d.properties.postal}-mx`)
        .on('mouseover', this.handleMouseover)
        .on('mouseout', this.handleMouseout);

      // Color each federal state.
      map.selectAll('path').style('fill', ({ properties }) => {
        const { confirmed } = this.statsByState[properties.postal];
        return this.colorScaleCases(confirmed);
      });
    },

    handleMouseout(d) {
      // this.activeState = null;
      d3.select(`#${d.properties.postal}-mx`)
        .transition()
        .duration('50')
        .attr('opacity', '1');

      d3.select('#container .tooltip')
        .transition()
        .duration('300')
        .style('opacity', '0');
    },

    handleMouseover(d) {
      d3.select('#container .tooltip')
        .transition()
        .duration('50')
        .style('opacity', '0.85');
      // .style('left', `${d3.event.pageX}px`)
      // .style('top', `${d3.event.pageY - this.h}px`);

      this.activeState = this.statsByState[d.properties.postal];
      d3.select(`#${d.properties.postal}-mx`)
        .transition()
        .duration('50')
        .attr('opacity', '0.75');
    }
  },
  computed: {
    ...mapState({
      stats: state => state.stats,
      statsByState: state => state.statsByState
    })
  }
};
</script>

<style>
.tooltip {
  right: 20px;
  position: absolute;
}
.legendAxis {
  font-size: 12px;
}
</style>