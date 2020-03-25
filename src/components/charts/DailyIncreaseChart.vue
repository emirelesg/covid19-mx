<template>
  <v-card elevation="4">
    <v-card-title class="font-weight-regular headline">Casos Nuevos Diarios</v-card-title>
    <v-card-subtitle>El incremento de los casos confirmados por día</v-card-subtitle>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12">
          <loading
            v-if="!loaded"
            message="Cargando Gráfica..."
            :height="style.height"
          />
          <bar-chart
            v-show="loaded"
            ref="barChart"
            :chart-data="data"
            :styles="style"
            :options="options"
          ></bar-chart>
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
import { hex2rgba } from '@/plugins/helper';
import BarChart from '@/components/charts/BaseBarChart';
import Loading from '@/components/Loading';
import colors from 'vuetify/lib/util/colors';

export default {
  name: 'DailyIncreaseChart',
  components: {
    BarChart,
    Loading
  },
  data() {
    return {
      isMounted: false,
      chartCreated: false,
      data: {
        datasets: [
          {
            barPercentage: 0.7,
            borderWidth: 1,
            borderColor: colors.blue.accent3,
            backgroundColor: hex2rgba(colors.blue.accent4, 0.3),
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
        elements: {},
        scales: {
          xAxes: [
            {
              type: 'time',
              offset: true,
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
        this.data.datasets[0].data = this.timeseries
          .slice(1)
          .map((data, i) => ({
            t: data.date,
            y: data.confirmed - this.timeseries[i].confirmed
          }));
        if (this.$refs.barChart) this.$refs.barChart.update(0);
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