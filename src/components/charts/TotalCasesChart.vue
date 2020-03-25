<template>
  <v-card elevation="4">
    <v-card-title class="font-weight-regular headline">Casos Totales</v-card-title>
    <v-card-subtitle>El total de casos confirmados acomulado</v-card-subtitle>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12">
          <v-tabs v-model="tab" color="primary">
            <v-tab>Lineal</v-tab>
            <v-tab>Logarítmico</v-tab>
          </v-tabs>
          <loading
            v-if="!loaded"
            message="Cargando Gráfica..."
            :height="style.height"
          />
          <line-chart
            v-show="loaded"
            ref="lineChart"
            :chart-data="data"
            :styles="style"
            :options="options"
          ></line-chart>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * Plot the progress of the active topics.
 */
import { mapState } from 'vuex';
import { hex2rgba } from '@/plugins/helper.js';
import LineChart from '@/components/charts/BaseLineChart';
import Loading from '@/components/Loading';
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
      tab: 0,
      data: {
        datasets: [
          {
            borderColor: colors.red.base,
            backgroundColor: hex2rgba(colors.red.base, 0.1),
            pointBackgroundColor: colors.red.base,
            pointHitRadius: 20,
            borderWidth: 2,
            data: []
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
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
              time: {
                tooltipFormat: 'LL'
              },
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
        height: `${400 - 48}px`
      }
    };
  },
  watch: {
    loaded() {
      this.init();
    },
    tab(val) {
      if (this.$refs.lineChart) this.$refs.lineChart.update(val);
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
        this.data.datasets[0].data = this.timeseries.map(data => ({
          t: data.date,
          y: data.confirmed
        }));
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
