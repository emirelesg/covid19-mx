<template>
  <card
    :title="labels.title[mode.key]"
    :subtitle="labels.subtitle[mode.key]"
    loadingMessage="Cargando Gráfica..."
    :loaded="loaded"
  >
    <template v-slot:content>
      <v-tabs v-model="tab" :color="mode.colorStr">
        <v-tab>Lineal</v-tab>
        <v-tab>Logarítmico</v-tab>
        <v-spacer></v-spacer>
        <v-checkbox
          v-if="mode.prediction"
          hide-details
          dense
          class="ma-0 pa-0 my-auto"
          v-model="prediction"
          label="Predicción"
        ></v-checkbox>
      </v-tabs>
      <v-alert
        v-if="mode.prediction"
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
import {
  baseLineOptions,
  baseChartOptions,
  round,
  lineColor,
  labels
} from '@/plugins/helper';

export default {
  name: 'TotalCasesChart',
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
      labels: labels.totalCases,
      meanGrowthFactor: null,
      meanGrowthFactorDays: 5,
      prediction: false,
      tab: 0,
      data: {
        datasets: [
          baseLineOptions('red', 'base'),
          baseLineOptions('orange', 'base', true)
        ]
      },
      options: baseChartOptions('Fecha', ''),
      style: {
        paddingTop: '16px',
        height: `${400 - 48}px`
      }
    };
  },
  watch: {
    loaded(val) {
      if (val) {
        this.reset();
        this.update();
      }
    },
    tab() {
      this.update();
    },
    prediction() {
      this.update();
    },
    mode() {
      this.reset();
      this.update();
    }
  },
  mounted() {
    this.reset();
    this.update();
  },
  methods: {
    update() {
      this.data.datasets[1].hidden = !this.prediction;
      if (this.$refs.chart) {
        this.$refs.chart.update(
          this.tab === 1,
          this.labels.yLabel[this.mode.key]
        );
      } else {
        this.options.scales.yAxes[0].scaleLabel.labelString = this.labels.yLabel[
          this.mode.key
        ];
      }
    },
    reset() {
      if (!this.latest.date || this.timeseries.length === 0) return;

      // Reset controls.
      this.tab = 0;
      this.prediction = false;

      // Index that defines the start of the timeseries data.
      let startOfData = 0;

      // If flag, remove all values until the first positive value.
      if (this.mode.filterStartOfData) {
        for (let i = 0; i < this.timeseries.length; i += 1) {
          if (this.timeseries[i][this.mode.key].delta > 0) {
            startOfData = i - 1;
            break;
          }
        }
      }

      // Plot data.
      this.data.datasets[0] = {
        ...this.data.datasets[0],
        ...lineColor(this.mode.colorStr, this.mode.colorShade)
      };
      this.data.datasets[0].data = this.timeseries
        .slice(startOfData)
        .map(data => ({
          t: data.date,
          y: data[this.mode.key].value
        }));

      // Prediction plot data.
      this.meanGrowthFactor = round(
        this.timeseries
          .slice(-this.meanGrowthFactorDays)
          .reduce((a, data) => a + data[this.mode.key].growthFactor, 0) /
          this.meanGrowthFactorDays,
        4
      );
      this.data.datasets[1].data = [
        {
          t: this.latest.date,
          y: this.latest[this.mode.key].value
        },
        {
          t: this.latest.date.clone().add(1, 'day'),
          y: round(this.latest[this.mode.key].value * this.meanGrowthFactor, 0)
        }
      ];
    }
  },
  computed: {
    ...mapState({
      timeseries: state => state.timeseries,
      latest: state => state.latest,
      mode: state => state.mode
    })
  }
};
</script>
