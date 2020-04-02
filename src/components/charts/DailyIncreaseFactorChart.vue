<template>
  <v-card elevation="4">
    <v-card-title class="font-weight-regular headline">Factor de Crecimiento</v-card-title>
    <v-card-subtitle>
      Muestra el factor por el cual aumentan los casos día a
      día
    </v-card-subtitle>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12">
          <loading
            v-if="!loaded"
            message="Cargando Gráfica..."
            :height="style.height"
          />
          <chart
            v-show="loaded"
            ref="chart"
            :chart-data="data"
            :styles="style"
            :options="options"
          ></chart>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Chart from '@/components/charts/BaseChart';
import Loading from '@/components/Loading';
import { baseLineOptions, baseChartOptions } from '@/plugins/helper';

export default {
  name: 'DailyIncreaseFactorChart',
  components: {
    Chart,
    Loading
  },
  data() {
    return {
      isMounted: false,
      chartCreated: false,
      data: {
        datasets: [baseLineOptions('orange')]
      },
      options: baseChartOptions('Fecha', 'Factor', false, 1),
      style: {
        paddingTop: '16px',
        height: `400px`
      }
    };
  },
  watch: {
    loaded() {
      this.init();
    }
  },
  mounted() {
    this.isMounted = true;
    this.init();
  },
  methods: {
    init() {
      if (!this.chartCreated && this.loaded && this.isMounted) {
        this.chartCreated = true;
        this.data.datasets[0].data = this.timeseries
          .slice(1)
          .map((data, i) => ({
            t: data.date,
            y: data.confirmed / this.timeseries[i].confirmed
          }));

        this.data.datasets[0].data.splice(0, 1);
        if (this.$refs.chart) this.$refs.chart.update(0);
      }
    }
  },
  computed: {
    ...mapState({
      timeseries: state => state.timeseries,
      loaded: state => state.stats.loaded
    })
  }
};
</script>
