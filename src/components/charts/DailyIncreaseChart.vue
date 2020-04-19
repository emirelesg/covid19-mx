<template>
  <card
    title="Casos Nuevos Diarios"
    subtitle="El incremento de los casos confirmados por día"
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
import { baseBarOptions, baseChartOptions } from '@/plugins/helper';

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
      data: {
        datasets: [baseBarOptions('blue')]
      },
      options: baseChartOptions('Fecha', 'Casos Confirmados Diarios', true),
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
    }
  },
  mounted() {
    this.reset();
    this.update();
  },
  methods: {
    update() {
      if (this.$refs.chart) this.$refs.chart.update(0);
    },
    reset() {
      if (this.timeseries.length === 0) return;
      this.data.datasets[0].data = this.timeseries.map(data => ({
        t: data.date,
        y: data.confirmedDelta
      }));
    }
  },
  computed: {
    ...mapState({
      timeseries: state => state.timeseries
    })
  }
};
</script>
