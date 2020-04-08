<template>
  <card
    title="Casos Nuevos Diarios"
    subtitle="El incremento de los casos confirmados por día"
    loadingMessage="Cargando Gráfica..."
    :loaded="loaded"
  >
    <template v-slot:content>
      <chart
        ref="chart"
        :chart-data="data"
        :styles="style"
        :options="options"
      ></chart>
    </template>
  </card>
</template>

<script>
/**
 * Bar chart for displaying the increase of confirmed cases by day.
 */
import { mapState } from 'vuex';
import Card from '@/components/Card';
import Chart from '@/components/charts/BaseChart';
import { baseBarOptions, baseChartOptions } from '@/plugins/helper';

export default {
  name: 'DailyIncreaseChart',
  components: {
    Chart,
    Card
  },
  data() {
    return {
      isMounted: false,
      chartCreated: false,
      data: {
        datasets: [baseBarOptions('blue')]
      },
      options: baseChartOptions('Fecha', 'Casos Confirmados Diarios', true),
      style: {
        paddingTop: '0px',
        height: '400px'
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
        this.data.datasets[0].data = this.confirmedDeltaData;
        if (this.$refs.chart) this.$refs.chart.update(0);
      }
    }
  },
  computed: {
    ...mapState({
      loaded: state => state.loaded,
      confirmedDeltaData: state =>
        state.timeseries.map(d => ({
          t: d.date,
          y: d.confirmedDelta
        }))
    })
  }
};
</script>
