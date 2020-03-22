<template>
  <v-card outlined>
    <v-card-title class="font-weight-regular headline">Casos Totales</v-card-title>
    <v-card-subtitle>El total de casos confirmados acomulado</v-card-subtitle>
    <v-card-text>
      <v-tabs v-model="tab" class="mb-3" color="indigo">
        <v-tab>Lineal</v-tab>
        <v-tab>Logarítmico</v-tab>
      </v-tabs>
      <v-row no-gutters>
        <v-col cols="12" class="my-4">
          <line-chart
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
import LineChart from './LineChart.vue';
import { hex2rgba } from '@/plugins/helper.js';
import colors from 'vuetify/lib/util/colors';
import moment from 'moment';

export default {
  name: 'TotalCasesChart',
  components: {
    LineChart
  },
  data() {
    return {
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
        height: '360px',
        position: 'relative'
      }
    };
  },
  beforeMount() {
    // Create the dataset time vs. commulative cases.
    const data = this.timeseries.map(data => ({
      t: moment(data.date),
      y: data.confirmed
    }));
    const plot = {
      borderColor: colors.red.base,
      backgroundColor: hex2rgba(colors.red.base, 0.1),
      borderWidth: 2,
      pointBackgroundColor: colors.red.base,
      data
    };
    this.data.datasets.push(plot);
  },
  watch: {
    tab(val) {
      if (this.$refs.lineChart) this.$refs.lineChart.update(val);
    }
  },
  methods: {},
  computed: {
    ...mapState({
      timeseries: state => state.timeseries
    })
  }
};
</script>
