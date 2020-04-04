<template>
  <v-card elevation="4" height="100%">
    <v-card-title class="font-weight-regular headline">
      <span>Casos Totales</span>
    </v-card-title>
    <v-card-subtitle>El total de casos confirmados acomulado</v-card-subtitle>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12">
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
          <!-- <v-alert
            class="ma-0 mt-4 body-2"
            :value="prediction"
            transition="fade-transition"
            type="info"
            text
          >
            La predicción se hace tomando el promedio del factor de crecimiento
            en los casos totales acumulados de los últimos
            {{ daysForGrowthEstimation }} días.
          </v-alert>-->
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
import moment from 'moment';

export default {
  name: 'TotalCasesChart',
  components: {
    Chart,
    Loading
  },
  data() {
    return {
      daysForGrowthEstimation: 10,
      prediction: true,
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
        const growth = this.averageGrowthFactor(this.daysForGrowthEstimation);
        this.data.datasets[1].data = [
          last,
          { t: moment(last.t).add(1, 'day'), y: Math.round(last.y * growth) }
        ];
        this.update();
      }
    },
    averageGrowthFactor(n) {
      // Calculate the average growth factor for the last n elements. If n is 0, then the growth is
      // averaged using all data poitns.
      const last = this.timeseries.slice(-n);
      const growthFactors = last
        .slice(1)
        .map((data, i) => data.confirmed / last[i].confirmed);
      // .sort((a, b) => a - b);
      const meanGrowth =
        growthFactors.reduce((a, growth) => a + growth, 0) / (last.length - 1);
      // const medianGrowth =
      //   growthFactors.length % 2 === 0
      //     ? growthFactors[growthFactors.length / 2]
      //     : (growthFactors[(growthFactors.length - 1) / 2] +
      //         growthFactors[(growthFactors.length + 1) / 2]) /
      //       2;
      return meanGrowth;
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
