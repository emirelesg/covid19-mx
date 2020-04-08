<template>
  <card
    title="Factor de Crecimiento"
    subtitle="Un indicador del control de la pandemia"
    loadingMessage="Cargando Gráfica..."
    :loaded="loaded"
  >
    <template v-slot:content>
      <v-alert class="ma-0 body-2" type="info" color="teal" text>
        El factor de crecimiento se calcula con
        <strong>
          los casos acumulados de hoy / los casos acumulados de ayer.
        </strong>
        Un factor de crecimiento que constantemente se reduce es un indicador de
        que la pandemia está bajo control. Cuando el factor es igual a 1, esto
        indica que no hay un incremento en los casos acumulados.
      </v-alert>
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
import Card from '@/components/Card';
import { mapState } from 'vuex';
import Chart from '@/components/charts/BaseChart';
import { baseLineOptions, baseChartOptions } from '@/plugins/helper';

export default {
  name: 'GrowthFactorChart',
  components: {
    Chart,
    Card
  },
  data() {
    return {
      isMounted: false,
      chartCreated: false,
      data: {
        datasets: [baseLineOptions('teal', 'base')]
      },
      options: baseChartOptions('Fecha', 'Factor', false, 1),
      style: {
        paddingTop: '16px',
        height: `${400 - 72}px`
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
        this.data.datasets[0].data = this.growthFactorData;
        if (this.$refs.chart) this.$refs.chart.update(0);
      }
    }
  },
  computed: {
    ...mapState({
      loaded: state => state.loaded,
      growthFactorData: state =>
        state.timeseries.slice(14).map(d => ({
          t: d.date,
          y: d.growthFactor
        }))
    })
  }
};
</script>
