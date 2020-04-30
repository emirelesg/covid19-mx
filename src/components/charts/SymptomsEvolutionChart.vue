<template>
  <card
    title="Evolución del Inicio de Sintomas"
    subtitle="Animación de los datos reportados para cada día desde el 12 de abril"
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
import { mapActions, mapState } from 'vuex';
import Card from '@/components/Card';
import Chart from '@/components/charts/BaseChart';
import { baseBarOptions, baseChartOptions } from '@/plugins/helper';
import colors from 'vuetify/lib/util/colors';

export default {
  name: 'SymptomsEvolutionChart',
  components: {
    Chart,
    Card
  },
  data() {
    return {
      loaded: false,
      stepDuration: 300,
      timeout: null,
      annotations: [
        {
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: '',
          borderWidth: 2,
          borderColor: colors.indigo.base,
          label: {
            content: 'Hoy',
            enabled: true,
            position: 'top'
          }
        }
      ],
      idx: 0,
      data: {
        datasets: [baseBarOptions('blue', 'base')]
      },
      options: baseChartOptions('Fecha', '# de Personas', true),
      style: {
        paddingTop: '16px',
        height: '400px'
      }
    };
  },
  computed: {
    ...mapState({
      stats: state => state.statsBySymptoms
    })
  },
  async mounted() {
    let loaded = await this.loadStatsBySymptoms();
    if (loaded) {
      this.options.scales.yAxes[0].ticks.max =
        Math.round((this.stats.maxCases * 1.2) / 100) * 100;
      this.options.animation = {
        duration: this.stepDuration,
        easing: 'linear'
      };
      this.options.tooltips.enabled = false;
      this.loaded = true;
      this.animate();
    }
  },
  destroyed() {
    if (this.timeout) clearTimeout(this.timeout);
  },
  methods: {
    ...mapActions(['loadStatsBySymptoms']),
    animate() {
      this.data.datasets[0].data = this.stats.dateKeys.map(d => ({
        t: d,
        y: this.stats.cases[d][this.idx]
      }));
      this.annotations[0].value = this.stats.dates[this.idx];
      this.annotations[0].label.content = this.stats.dates[this.idx].format(
        'll'
      );
      if (this.$refs.chart) {
        this.$refs.chart.update(0, undefined, this.annotations);
      }
      this.idx = this.idx + 1 < this.stats.dates.length ? this.idx + 1 : 0;
      this.timeout = setTimeout(this.animate, this.stepDuration);
    }
  }
};
</script>
