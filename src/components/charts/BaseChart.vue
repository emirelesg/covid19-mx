<script>
import { Line } from 'vue-chartjs';
import { readableLog, afterBuildTicks } from '@/plugins/helper';
// eslint-disable-next-line
import chartjsPluginAnnotation from 'chartjs-plugin-annotation';

export default {
  name: 'Chart',
  extends: Line,
  props: ['chartData', 'options'],
  data() {
    return {
      defaultTickCallback: undefined
    };
  },
  methods: {
    yMax(value) {
      this.$data._chart.options.scales.yAxes[0].ticks.max = value;
    },
    yLabel(value) {
      this.$data._chart.options.scales.yAxes[0].scaleLabel.labelString = value;
    },
    annotations(arr) {
      if (!this.$data._chart.options.annotation) {
        this.$data._chart.options.annotation = { annotations: [] };
      }
      this.$data._chart.options.annotation.annotations = arr;
    },
    update(isLog) {
      // Get the y-axis from the chart object.
      const yAxis = this.$data._chart.options.scales.yAxes[0];

      // Change the type of the graph.
      yAxis.type = isLog ? 'logarithmic' : 'linear';

      // Store the default tick algorithm.
      if (this.defaultTickCallback === undefined) {
        this.defaultTickCallback = yAxis.ticks.callback;
      }

      // Update the tick algorithm to use powers of 10 if log scale is used.
      yAxis.ticks.callback = isLog ? readableLog : this.defaultTickCallback;
      yAxis.afterBuildTicks = isLog ? afterBuildTicks : undefined;

      // Update chart.
      this.$data._chart.update();
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
