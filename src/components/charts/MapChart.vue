<template>
  <card
    :title="labels.title[mode.key]"
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

import {
  select,
  interpolateOrRd,
  interpolateYlOrBr,
  interpolatePuBu,
  interpolateBuPu,
  interpolateBlues,
  hsl
} from 'd3';
import { geoPath, geoMercator } from 'd3-geo';
import { mapState } from 'vuex';
import Card from '@/components/Card';
import StateInfo from '@/components/charts/StateInfo';
import scaleCluster from 'd3-scale-cluster';
import { labels } from '@/plugins/helper';

const schemes = {
  confirmed: interpolateOrRd,
  suspected: interpolateYlOrBr,
  deaths: interpolatePuBu,
  active: interpolateBuPu,
  tests: v => {
    const color = hsl(interpolateBlues(v));
    color.h = 190;
    return color;
  }
};

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
      labels: labels.map,
      w: 500,
      h: 400,
      legend: null,
      map: null,
      colorScale: null,
      active: null,
      mapCreated: false
    };
  },

  watch: {
    loaded(val) {
      if (val) {
        this.$nextTick(this.init);
      }
    },
    mode() {
      this.reset();
    }
  },
  mounted() {
    this.$nextTick(this.init);
  },
  methods: {
    init() {
      if (!this.mapCreated && this.loaded) {
        this.map = select('#map');
        this.legend = select('#legend');
        this.generateMap();
        this.reset();
        this.mapCreated = true;
      }
    },
    reset() {
      this.legend.selectAll('*').remove();
      this.colorScale = this.generateScale();
      this.generateLegend();
      this.colorMap();
    },
    generateScale() {
      return scaleCluster()
        .domain(Object.values(this.states).map(obj => obj[this.mode.key]))
        .range(
          Array(6)
            .fill()
            .map((_, i) => schemes[this.mode.key](i / 5))
        );
    },
    colorMap() {
      this.map
        .selectAll('path')
        .transition()
        .duration('500')
        .style('stroke-width', '1px')
        .style('fill', ({ properties }) => {
          return this.colorScale(this.states[properties.postal][this.mode.key]);
        });
    },
    generateMap() {
      // Define the projection and generator for the map.
      const geoProjection = geoMercator()
        .center([-100, 22])
        .translate([this.w / 1.7, this.h / 1.7])
        .scale([this.w / 0.51]);
      const geoGenerator = geoPath().projection(geoProjection);

      // Join the features to path elements.
      // Create path elements and update the d attribute.
      this.map
        .attr('transform', `translate(0.5, -20.5)`)
        .style('stroke', '#888')
        .style('stroke-width', 0)
        .selectAll('path')
        .data(this.geojson.features)
        .enter()
        .append('path')
        .style('fill', 'white')
        .attr('d', geoGenerator)
        .attr('id', d => `${d.properties.postal}-mx`)
        .on('mouseover', this.handleMouseover)
        .on('mouseout', this.handleMouseout);
    },

    generateLegend() {
      const blockWidth = 17;
      const blockPadding = 7;
      this.legend.attr('transform', `translate(25.5, 220.5)`);

      // For each cluster draw a legend block.
      const clusters = [0, ...this.colorScale.clusters()];
      clusters.forEach((c, i) => {
        const y = i * (blockWidth + blockPadding);
        this.legend
          .append('rect')
          .attr('x', 0)
          .attr('y', y)
          .attr('width', `${blockWidth}px`)
          .attr('height', `${blockWidth}px`)
          .attr('stroke', '#888')
          .style('fill', this.colorScale(c));
        this.legend
          .append('text')
          .attr('alignment-baseline', 'middle')
          .attr('x', blockWidth + 10)
          .attr('y', y + blockWidth / 2)
          .text(
            i < clusters.length - 1
              ? `${c} - ${clusters[i + 1]}`
              : `más de ${c}`
          )
          .style('fill', '#444');
      });
    },

    handleMouseout(d) {
      select(`#${d.properties.postal}-mx`).attr('opacity', '1');
      select('#map-tooltip')
        .transition()
        .duration('300')
        .style('opacity', '0');
    },

    handleMouseover(d) {
      this.active = this.states[d.properties.postal];
      select(`#${d.properties.postal}-mx`).attr('opacity', '0.75');
      select('#map-tooltip')
        .transition()
        .duration('50')
        .style('opacity', '0.85');
    }
  },
  computed: {
    ...mapState({
      states: state => state.stats.states,
      geojson: state => state.geojson,
      mode: state => state.mode
    })
  }
};
</script>
