<template>
  <v-alert
    border="left"
    colored-border
    type="info"
    color="primary"
    dismissible
    elevation="4"
  >
    <div>
      Este es un sitio no oficial que recopila y presenta los datos entregados por la Secretaría de Salud de México
      —
      <a
        href="https://twitter.com/SSalud_mx"
      >@SSalud_mx</a>.
    </div>
    <div>
      Fuente:
      <a class="d-none d-sm-inline" :href="source">{{ source }}</a>
      <a class="d-sm-none" :href="source">Prensa de la Secretaría de Salud</a>
    </div>
  </v-alert>
</template>

<script>
export default {
  name: 'disclaimer',
  data() {
    return {
      source:
        'https://www.gob.mx/salud/prensa/nuevo-coronavirus-en-el-mundo-covid-19-comunicado-tecnico-diario-238669'
    };
  }
};
</script>
