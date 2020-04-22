<template>
  <v-alert
    id="update-alert"
    class="v-card v-card--outlined my-3"
    border="left"
    colored-border
    type="error"
    color="primary"
    dismissible
    transition="fade-transition"
    :value="!isClosed"
    @input="CLOSE_UPDATE_ALERT"
  >
    <div>
      Por declaración de la Fase 3, el mapeo de casos se realizará en base a la
      <b>entidad de residencia</b> del paciente (antes entidad de la unidad
      médica). Se han actualizado los datos a partir del 21 de abril de 2020.
    </div>
    <div>
      Fuente: Secretaría de Salud —
      <a href="/static/informe-diario-2020-04-21.pdf" target="_blank"
        >Informe diario del 21 de abril de 2020</a
      >
    </div>
  </v-alert>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Alert',
  data() {
    return {};
  },
  methods: {
    ...mapMutations(['CLOSE_UPDATE_ALERT'])
  },
  computed: {
    ...mapState({
      isClosed: state => state.updateAlertClosed
    })
  }
};
</script>
