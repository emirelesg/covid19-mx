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
        <defs>
          <linearGradient id="gradient" />
        </defs>
        <g id="legendAxis" class="caption" visible="invisible" />
        <g id="legend" />
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

import { interpolateMagma, select, scaleLinear, axisBottom } from 'd3';
import { geoPath, geoMercator } from 'd3-geo';
import { mapState } from 'vuex';
import Card from '@/components/Card';
import StateInfo from '@/components/charts/StateInfo';

export default {
  name: 'MapCard',
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
    colorScale: k => interpolateMagma(1 - k),
    colorScaleCases(cases) {
      return this.colorScale(cases / this.stats.maxConfirmedByState);
    },
    init() {
      if (!this.mapCreated && this.loaded && this.isMounted) {
        this.mapCreated = true;
        this.generateMap();
        this.generateLegend();
      }
    },
    generateMap() {
      // Select the map where the states are drawn.
      this.map = select('#map')
        .attr('stroke', '#aaa')
        .attr('stroke-width', '1.5')
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
        const { confirmed } = this.stats.byState[properties.postal];
        return this.colorScaleCases(confirmed);
      });
    },

    generateLegend() {
      const w = this.w * 0.75;
      const h = 10;
      const xAxis = (this.w - w) / 2;
      const xBar = xAxis;
      const yBar = this.h - h - 20;
      const yAxis = this.h - 20;

      // Add 10 color stops to the gradient.
      const mainGradient = select('#gradient');
      for (let i = 0; i <= 1; i += 0.1) {
        mainGradient
          .append('stop')
          .attr('stop-color', this.colorScale(i))
          .attr('offset', `${i}`);
      }

      // Create the box for the legend and apply gradient.
      select('#legend')
        .append('rect')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('width', `${w}px`)
        .attr('height', `${h}px`)
        .attr('transform', `translate(${xBar}, ${yBar})`)
        .style('fill', 'url(#gradient)');

      // Create the axis for the legend.
      const legendScale = scaleLinear()
        .range([0, w])
        .domain([0, this.stats.maxConfirmedByState]);
      const legendAxis = axisBottom()
        .scale(legendScale)
        .tickSize(6)
        .ticks(5);
      select('#legendAxis')
        .attr('transform', `translate(${xAxis}, ${yAxis})`)
        .call(legendAxis);
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
      this.active = this.stats.byState[d.properties.postal];
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
      loaded: state => state.loaded,
      stats: state => state.stats,
      geojson: state => state.geojson
    })
  }
};
</script>
