<template>
  <card
    title="Evolución del Inicio de Síntomas"
    subtitle="Animación de los datos reportados para cada día desde el 12 de abril"
    loadingMessage="Cargando Gráfica..."
    :loaded="loaded"
  >
    <template v-slot:content>
      <v-tabs v-model="tab" color="blue">
        <v-tab>Por Día</v-tab>
        <v-tab>Acumulado</v-tab>
      </v-tabs>
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
import {
  baseBarOptions,
  baseChartOptions,
  baseLineOptions
} from '@/plugins/helper';
import colors from 'vuetify/lib/util/colors';

export default {
  name: 'SymptomsEvolutionChart',
  components: {
    Chart,
    Card
  },
  data() {
    return {
      tab: 0,
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
        datasets: [
          baseBarOptions('blue', 'base'),
          baseLineOptions('blue', 'lighten1')
        ]
      },
      options: baseChartOptions('Fecha', '# de Personas', true),
      style: {
        paddingTop: '16px',
        height: `${400 - 48}px`
      }
    };
  },
  watch: {
    tab() {
      this.idx = 0;
      this.updateScale();
    }
  },
  async mounted() {
    let loaded = await this.loadStatsBySymptoms();
    if (loaded) {
      this.loaded = true;
      this.options.animation = {
        duration: this.stepDuration,
        easing: 'linear'
      };
      this.options.tooltips.enabled = false;
      this.updateScale();
      this.animate();
    }
  },
  destroyed() {
    if (this.timeout) clearTimeout(this.timeout);
  },
  methods: {
    ...mapActions(['loadStatsBySymptoms']),
    updateScale() {
      const max = this.tab === 0 ? this.stats.maxCases : this.stats.totalCases;
      const maxScaled = Math.round((max * 1) / 100) * 100;
      if (this.$refs.chart) {
        this.$refs.chart.yMax(maxScaled);
      } else {
        this.options.scales.yAxes[0].ticks.max = maxScaled;
      }
    },
    animate() {
      // Daily chart.
      this.data.datasets[0].hidden = this.tab !== 0;
      this.data.datasets[0].data = this.stats.dateKeys.map(d => ({
        t: d,
        y: this.stats.cases[d][this.idx]
      }));

      // Cumulative chart.
      let acc = 0;
      this.data.datasets[1].hidden = this.tab !== 1;
      this.data.datasets[1].data = this.data.datasets[0].data
        .filter((_, i) => i <= this.stats.datesIdxKeys[this.idx])
        .map(obj => {
          acc += obj.y;
          return {
            t: obj.t,
            y: acc
          };
        });

      // Set vertical guide to the current date.
      this.annotations[0].value = this.stats.dates[this.idx];
      this.annotations[0].label.content = this.stats.dates[this.idx].format(
        'll'
      );

      // Update charts.
      if (this.$refs.chart) {
        this.$refs.chart.annotations(this.annotations);
        this.$refs.chart.update(0);
      }

      // Set timeout for next step in the animation sequence.
      this.idx = this.idx + 1 < this.stats.dates.length ? this.idx + 1 : 0;
      this.timeout = setTimeout(this.animate, this.stepDuration);
    }
  },
  computed: {
    ...mapState({
      stats: state => state.statsBySymptoms
    })
  }
};
</script>
