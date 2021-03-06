<template>
  <card
    :title="labels.title[mode.key]"
    :subtitle="labels.subtitle[mode.key]"
    loadingMessage="Cargando Gráfica..."
    :loaded="loaded"
  >
    <template v-slot:content>
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
import { mapState } from 'vuex';
import Card from '@/components/Card';
import Chart from '@/components/charts/BaseChart';
import {
  baseBarOptions,
  baseLineOptions,
  baseChartOptions,
  barColor,
  labels,
  rollingAvg
} from '@/plugins/helper';

export default {
  name: 'DailyIncreaseChart',
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
      labels: labels.dailyIncrease,
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
          baseBarOptions('red', 'base')
        ]
      },
      options: baseChartOptions('Fecha', '', true, undefined, true),
      style: {
        paddingTop: '0px',
        height: '400px'
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
      if (this.$refs.chart) {
        this.$refs.chart.yLabel(this.labels.yLabel[this.mode.key]);
        this.$refs.chart.update(0);
      } else {
        this.options.scales.yAxes[0].scaleLabel.labelString = this.labels.yLabel[
          this.mode.key
        ];
      }
    },
    reset() {
      if (this.timeseries.length === 0) return;

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
      this.data.datasets[1] = {
        ...this.data.datasets[1],
        ...barColor(this.mode.colorStr, this.mode.colorShade)
      };
      this.data.datasets[1].data = this.timeseries
        .slice(startOfData)
        .map(data => ({
          t: data.date,
          y: data[this.mode.key].delta
        }));

      // Average data.
      this.data.datasets[0].data = rollingAvg(
        this.data.datasets[1].data,
        7,
        true
      );
    }
  },
  computed: {
    ...mapState({
      timeseries: state => state.timeseries,
      mode: state => state.mode
    })
  }
};
</script>
