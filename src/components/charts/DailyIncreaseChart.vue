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
  baseChartOptions,
  barColor,
  labels
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
        datasets: [baseBarOptions('red')]
      },
      options: baseChartOptions('Fecha', '', true),
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
        this.$refs.chart.update(0, this.labels.yLabel[this.mode.key]);
      } else {
        this.options.scales.yAxes[0].scaleLabel.labelString = this.labels.yLabel[
          this.mode.key
        ];
      }
    },
    reset() {
      if (this.timeseries.length === 0) return;
      this.data.datasets[0] = {
        ...this.data.datasets[0],
        ...barColor(this.mode.colorStr, this.mode.colorShade)
      };
      this.data.datasets[0].data = this.timeseries
        .filter(({ date }) =>
          this.mode.startDate ? date.isSameOrAfter(this.mode.startDate) : true
        )
        .map(data => ({
          t: data.date,
          y: data[this.mode.key].delta
        }));
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
