<script>
import { Bar } from 'vue-chartjs';

export default {
  name: 'BarChart',
  extends: Bar,
  props: ['chartData', 'options'],
  methods: {
    update(isLog) {
      this.$data._chart.options.scales.yAxes[0].type = isLog
        ? 'logarithmic'
        : 'linear';
      this.$data._chart.update();
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
