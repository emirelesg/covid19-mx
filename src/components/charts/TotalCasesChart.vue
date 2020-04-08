<template>
  <card
    title="Casos Totales"
    subtitle="El total de casos confirmados acumulado"
    loadingMessage="Cargando Gráfica..."
    :loaded="loaded"
  >
    <template v-slot:content>
      <v-tabs v-model="tab" color="primary">
        <v-tab>Lineal</v-tab>
        <v-tab>Logarítmico</v-tab>
        <v-spacer></v-spacer>
        <v-checkbox
          hide-details
          dense
          class="ma-0 pa-0 my-auto"
          v-model="prediction"
          label="Predicción"
        ></v-checkbox>
      </v-tabs>
      <v-alert
        class="ma-0 mt-4 body-2"
        :value="prediction"
        transition="fade-transition"
        type="warning"
        text
      >
        La predicción se hace con el promedio del <strong>factor</strong> de
        crecimiento de los casos totales acumulados de los últimos
        <strong>{{ meanGrowthFactorDays }} días.</strong>
        Este factor es de
        <strong>{{ meanGrowthFactor }}</strong>
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
  name: 'TotalCasesChart',
  components: {
    Chart,
    Card
  },
  data() {
    return {
      prediction: false,
      isMounted: false,
      chartCreated: false,
      tab: 0,
      data: {
        datasets: [
          baseLineOptions('red', 'base'),
          baseLineOptions('orange', 'base', true)
        ]
      },
      options: baseChartOptions('Fecha', 'Casos Confirmados'),
      style: {
        paddingTop: '16px',
        height: `${400 - 48}px`
      }
    };
  },
  watch: {
    loaded() {
      this.init();
    },
    tab() {
      this.update();
    },
    prediction() {
      this.update();
    }
  },
  mounted() {
    this.isMounted = true;
    this.init();
  },
  methods: {
    update() {
      this.data.datasets[1].hidden = !this.prediction;
      if (this.$refs.chart) this.$refs.chart.update(this.tab);
    },
    init() {
      if (!this.chartCreated && this.loaded && this.isMounted) {
        this.chartCreated = true;
        this.data.datasets[0].data = this.confirmedData;
        this.data.datasets[1].data = this.predictionData;
        this.update();
      }
    }
  },
  computed: {
    ...mapState({
      loaded: state => state.loaded,
      confirmedData: state =>
        state.timeseries.map(d => ({
          t: d.date,
          y: d.confirmed
        })),
      predictionData: state => [
        {
          t: state.timeseries[state.timeseries.length - 1].date,
          y: state.timeseries[state.timeseries.length - 1].confirmed
        },
        {
          t: state.prediction.date,
          y: state.prediction.confirmed
        }
      ],
      meanGrowthFactor: state => state.prediction.meanGrowthFactor,
      meanGrowthFactorDays: state => state.prediction.meanGrowthFactorDays
    })
  }
};
</script>
