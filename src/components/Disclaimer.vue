<template>
  <v-alert
    border="left"
    colored-border
    type="info"
    color="primary"
    dismissible
    transition="fade-transition"
    style="border: thin solid rgba(98, 0, 234, 0.2)"
    :value="!disclaimerClosed"
    @input="CLOSE_DISCLAIMER"
  >
    <div>
      Este es un sitio no oficial que presenta <strong>únicamente</strong> los
      datos oficiales de la Secretaría de Salud de México —
      <a href="https://twitter.com/SSalud_mx" target="_blank">@SSalud_mx</a>.
    </div>
    <div>
      Fuente:
      <a v-if="$vuetify.breakpoint.smAndUp" :href="source" target="_blank">
        {{ source }}
      </a>
      <a v-else :href="source" target="_blank"
        >Prensa de la Secretaría de Salud</a
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
      source:
        'https://www.gob.mx/salud/documentos/coronavirus-covid-19-comunicado-tecnico-diario-238449'
    };
  },
  methods: {
    ...mapMutations(['CLOSE_DISCLAIMER'])
  },
  computed: {
    ...mapState({
      disclaimerClosed: state => state.disclaimerClosed
    })
  }
};
</script>
