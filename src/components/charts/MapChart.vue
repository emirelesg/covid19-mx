<template>
  <card
    title="Casos Confirmados"
    subtitle="Mueve el cursor sobre una entidad para conocer más"
    loadingMessage="Cargando Mapa..."
    :loaded="loaded"
  >
    <template v-slot:content>
      <state-info id="map-tooltip" :state="active" />
      <svg
        style="vertical-align: top;"
        width="100%"
        height="400px"
        viewBox="0 0 500 400"
      >
        <g id="legend" class="caption" />
        <g id="map" />
      </svg>
    </template>
  </card>
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

import { select, interpolateMagma } from 'd3';
import { geoPath, geoMercator } from 'd3-geo';
import { mapState } from 'vuex';
import Card from '@/components/Card';
import StateInfo from '@/components/charts/StateInfo';
import scaleCluster from 'd3-scale-cluster';

export default {
  name: 'MapCard',
  props: {
    loaded: {
      type: Boolean,
      required: true
    }
  },
  components: {
    StateInfo,
    Card
  },
  data() {
    return {
      w: 500,
      h: 400,
      svg: null,
      map: null,
      colorScale: null,
      geoGenerator: null,
      geoProjection: null,
      active: null,
      isMounted: false,
      mapCreated: false
    };
  },
  mounted() {
    this.isMounted = true;
    this.$nextTick(this.init);
  },
  watch: {
    loaded() {
      this.$nextTick(this.init);
    }
  },
  methods: {
    generateScale() {
      //      '#E5D6EA',
      //     '#C798D3',
      //     '#9E58AF',
      //     '#7F3391',
      //     '#581F66',
      //     '#30003A'
      // var clr = d3
      //   .scaleLinear()
      //   .range([d3.interpolateReds(0), 'rgb(244, 67, 54)'])
      //   .domain([0, 5]);
      // var colourArray = d3.range(6).map(d => clr(d));
      // console.log(colourArray);
      var values = Object.entries(this.states)
        .reduce((arr, [, obj]) => [...arr, obj.confirmed], [])
        .sort((a, b) => a - b);
      var s = scaleCluster()
        .domain(values)
        .range(
          // colourArray
          // d3.schemeReds[6]
          Array(6)
            .fill()
            .map((_, i) => interpolateMagma(1 - i / 6))
        );
      return s;
    },
    init() {
      if (!this.mapCreated && this.loaded && this.isMounted) {
        this.mapCreated = true;
        this.colorScale = this.generateScale();
        this.generateMap();
        this.generateLegend();
      }
    },
    generateMap() {
      // Select the map where the states are drawn.
      this.map = select('#map')
        .attr('stroke', '#888')
        .attr('stroke-width', '1')
        .attr('transform', `translate(0, -20)`);

      // Define the projection and generator for the map.
      this.geoProjection = geoMercator()
        .center([-100, 22])
        .translate([this.w / 1.7, this.h / 1.7])
        .scale([this.w / 0.51]);
      this.geoGenerator = geoPath().projection(this.geoProjection);

      // Join the features to path elements.
      // Create path elements and update the d attribute.
      this.map
        .selectAll('path')
        .data(this.geojson.features)
        .enter()
        .append('path')
        .attr('d', this.geoGenerator)
        .attr('id', d => `${d.properties.postal}-mx`)
        .on('mouseover', this.handleMouseover)
        .on('mouseout', this.handleMouseout);

      // Color each federal state.
      this.map.selectAll('path').style('fill', ({ properties }) => {
        const { confirmed } = this.states[properties.postal];
        return this.colorScale(confirmed);
      });
    },

    generateLegend() {
      const legend = select('#legend');
      const blockWidth = 15;
      const blockPadding = 7;
      // Get the clusters or ranges for the color scale. Add 0 to the array.
      const clusters = [0, ...this.colorScale.clusters()];

      // Position legend and iterate through each item in the clusters.
      legend.attr('transform', `translate(${25}, ${225})`);
      for (let i = 0; i < clusters.length; i++) {
        const y = i * (blockWidth + blockPadding);
        legend
          .append('rect')
          .attr('x', 0.5)
          .attr('y', y)
          .attr('width', `${blockWidth}px`)
          .attr('height', `${blockWidth}px`)
          .attr('stroke', '#888')
          .style('fill', this.colorScale(clusters[i]));
        legend
          .append('text')
          .attr('alignment-baseline', 'middle')
          .attr('x', blockWidth + 10)
          .attr('y', y + blockWidth / 2)
          .text(
            i < clusters.length - 1
              ? `${clusters[i]} a ${clusters[i + 1]}`
              : `más de ${clusters[i]}`
          );
      }
    },

    handleMouseout(d) {
      select(`#${d.properties.postal}-mx`)
        .transition()
        .duration('50')
        .attr('opacity', '1');
      select('#map-tooltip')
        .transition()
        .duration('300')
        .style('opacity', '0');
    },

    handleMouseover(d) {
      this.active = this.states[d.properties.postal];
      select(`#${d.properties.postal}-mx`)
        .transition()
        .duration('50')
        .attr('opacity', '0.75');
      select('#map-tooltip')
        .transition()
        .duration('50')
        .style('opacity', '0.85');
    }
  },
  computed: {
    ...mapState({
      states: state => state.stats.states,
      statesAsArray: state => state.stats.statesAsArray,
      maxConfirmedByState: state =>
        Math.max(...state.stats.statesAsArray.map(data => data.confirmed)),
      geojson: state => state.geojson
    })
  }
};
</script>
