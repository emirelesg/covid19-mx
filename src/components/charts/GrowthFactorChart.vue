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
import {
  baseLineOptions,
  baseChartOptions,
  rollingAvg
} from '@/plugins/helper';

export default {
  name: 'GrowthFactorChart',
  components: {
    Chart,
    Card
  },
  props: {
    loaded: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      data: {
        datasets: [
          {
            ...baseLineOptions(
              'brown',
              'lighten1',
              undefined,
              'Promedio 7-días'
            ),
            hidden: true
          },
          baseLineOptions('teal', 'base')
        ]
      },
      options: baseChartOptions('Fecha', 'Factor', false, 1, true),
      style: {
        paddingTop: '16px',
        height: `${400 - 92}px`
      }
    };
  },
  watch: {
    loaded(val) {
      if (val) {
        this.reset();
        this.update();
      }
    }
  },
  mounted() {
    this.reset();
    this.update();
  },
  methods: {
    update() {
      if (this.$refs.chart) this.$refs.chart.update(0);
    },
    reset() {
      if (this.timeseries.length === 0) return;
      this.data.datasets[1].data = this.timeseries
        .slice(this.timeseries.length - 90)
        .map(data => ({
          t: data.date,
          y: data.confirmed.growthFactor
        }));
      this.data.datasets[0].data = rollingAvg(this.data.datasets[1].data, 7);
    }
  },
  computed: {
    ...mapState({
      timeseries: state => state.timeseries
    })
  }
};
</script>
