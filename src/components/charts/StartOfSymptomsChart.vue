<template>
  <card
    title="Inicio de Síntomas"
    subtitle="El número de personas que comenzaron con síntomas por día"
    loadingMessage="Cargando Gráfica..."
    :loaded="loaded"
  >
    <template v-slot:content>
      <v-alert class="ma-0 body-2" type="info" color="blue" text>
        Debido al tiempo de espera de un diangostico de COVID-19, existe un
        retraso entre el inicio de los síntomas y el conteo del caso. La gráfica
        por inicio de síntomas muestra el <b>verdadero</b> número de infectados
        por día.
      </v-alert>
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
  name: 'StartOfSymptoms',
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
        datasets: [
          baseBarOptions('blue', 'base', 'Por fecha de síntomas'),
          baseBarOptions('red', 'base', 'Por fecha de conteo')
        ]
      },
      options: baseChartOptions(
        'Fecha',
        '# de Personas',
        true,
        undefined,
        true
      ),
      style: {
        paddingTop: '16px',
        height: `${400 - 48}px`
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
      if (this.$refs.chart) {
        this.$refs.chart.update(0);
      }
    },
    reset() {
      if (
        this.timeseriesBySymptoms.length === 0 ||
        this.timeseries.length === 0
      )
        return;
      let thresh = this.timeseries[0].date.clone().subtract('7', 'day');
      this.data.datasets[0].data = this.timeseriesBySymptoms
        .filter(data => data.cases > 0 && data.date.isSameOrAfter(thresh))
        .map(data => ({
          t: data.date,
          y: data.cases
        }));
      this.data.datasets[1].data = this.timeseries.map(data => ({
        t: data.date,
        y: data.confirmed.delta
      }));
    }
  },
  computed: {
    ...mapState({
      timeseriesBySymptoms: state => state.timeseriesBySymptoms,
      timeseries: state => state.timeseries
    })
  }
};
</script>
