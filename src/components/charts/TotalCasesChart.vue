<template>
  <v-card elevation="4">
    <v-card-title class="font-weight-regular headline">Casos Totales</v-card-title>
    <v-card-subtitle>El total de casos confirmados acomulado</v-card-subtitle>
    <v-card-text>
      <loading v-if="!loaded" message="Cargando Gráfica..." height="400px"/>
      <div v-show="loaded">
        <v-tabs v-model="tab" color="primary">
          <v-tab>Lineal</v-tab>
          <v-tab>Logarítmico</v-tab>
        </v-tabs>
        <v-row no-gutters>
          <v-col cols="12" class>
            <line-chart
              ref="lineChart"
              :chart-data="data"
              :styles="style"
              :options="options"
            ></line-chart>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * Plot the progress of the active topics.
 */
import { mapState } from 'vuex';
import { hex2rgba } from '@/plugins/helper.js';
import LineChart from '@/components/charts/BaseLineChart.vue';
import Loading from '@/components/Loading.vue';
import colors from 'vuetify/lib/util/colors';

export default {
  name: 'TotalCasesChart',
  components: {
    LineChart,
    Loading
  },
  data() {
    return {
      isMounted: false,
      chartCreated: false,
      tab: null,
      data: {
        datasets: []
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          enabled: true,
          yAlign: 'bottom'
        },
        elements: {
          point: {
            pointStyle: 'circle',
            radius: 3
          },
          line: {
            tension: 0
          }
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              scaleLabel: {
                display: true,
                labelString: 'Fecha'
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Casos Confirmados'
              }
            }
          ]
        }
      },
      style: {
        paddingTop: '16px',
        height: `${400 - 48}px`,
        position: 'relative'
      }
    };
  },
  watch: {
    tab(val) {
      if (this.$refs.lineChart) this.$refs.lineChart.update(val);
    },
    loaded(val) {
      if (val && this.isMounted) this.init();
    }
  },
  mounted() {
    if (this.loaded) this.init();
    this.isMounted = true;
  },
  methods: {
    init() {
      if (!this.chartCreated) {
        this.chartCreated = true;
        // Create the dataset time vs. commulative cases.
        const data = this.timeseries.map(data => ({
          t: data.date,
          y: data.confirmed
        }));
        const plot = {
          borderColor: colors.red.base,
          backgroundColor: hex2rgba(colors.red.base, 0.1),
          borderWidth: 3,
          pointBackgroundColor: colors.red.base,
          pointHitRadius: 20,
          data
        };
        this.data.datasets.push(plot);
        if (this.$refs.lineChart) this.$refs.lineChart.update(0);
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
