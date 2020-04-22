<template>
  <v-alert
    class="v-card v-card--outlined mb-3"
    border="left"
    colored-border
    type="info"
    color="primary"
    dismissible
    transition="fade-transition"
    :value="!isClosed"
    @input="CLOSE_DISCLAIMER"
  >
    <div>
      Este es un sitio no oficial que presenta
      <strong>únicamente</strong> los datos oficiales de la Secretaría de Salud
      de México. Los datos en el sitio se actualizan diario a las 19:00 horas.
    </div>
    <div>
      Fuente:
      <a v-if="$vuetify.breakpoint.smAndUp" :href="source" target="_blank">
        {{ source }}
      </a>
      <a v-else :href="source" target="_blank"
        >Datos Abiertos — Secretaría de Salud</a
      >
    </div>
  </v-alert>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Disclaimer',
  data() {
    return {
      source: 'https://www.gob.mx/salud/documentos/datos-abiertos-152127'
    };
  },
  methods: {
    ...mapMutations(['CLOSE_DISCLAIMER'])
  },
  computed: {
    ...mapState({
      isClosed: state => state.disclaimerClosed
    })
  }
};
</script>
