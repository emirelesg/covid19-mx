<template>
  <card
    title="Casos Totales"
    subtitle="El total de casos confirmados acomulado"
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
        La predicción se hace con el promedio del factor de crecimiento de los
        casos totales acumulados de los últimos
        <strong>{{ meanGrowthFactorDays }} días.</strong>
        Este factor es de
        <strong>{{ Math.round(meanGrowthFactor() * 1000) / 1000 }}</strong>
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
import moment from 'moment';

export default {
  name: 'TotalCasesChart',
  components: {
    Chart,
    Card
  },
  data() {
    return {
      meanGrowthFactorDays: 5,
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
        this.data.datasets[0].data = this.timeseries.map(data => ({
          t: data.date,
          y: data.confirmed
        }));
        // Make a prediction for the next day.
        const last = this.data.datasets[0].data.slice(-1)[0];
        this.data.datasets[1].data = [
          last,
          {
            t: moment(last.t).add(1, 'day'),
            y: Math.round(last.y * this.meanGrowthFactor())
          }
        ];
        this.update();
      }
    },
    meanGrowthFactor() {
      if (!this.timeseries) return 0;
      // Calculate the average growth factor using n days.
      // We need n + 1 elements to calculate n growth factors.
      const last = this.timeseries.slice(-(this.meanGrowthFactorDays + 1));
      const growthFactors = last
        .slice(1)
        .map((data, i) => data.confirmed / last[i].confirmed);
      // .sort((a, b) => a - b);
      return (
        growthFactors.reduce((a, growth) => a + growth, 0) /
        growthFactors.length
      );
    }
  },
  computed: {
    ...mapState({
      timeseries: state => state.timeseries,
      loaded: state => state.loaded
    })
  }
};
</script>
