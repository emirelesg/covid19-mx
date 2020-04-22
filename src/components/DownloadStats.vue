<template>
  <v-menu offset-y open-on-hover>
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark outlined v-on="on">
        <v-icon left>mdi-download</v-icon>Datos
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click.stop="stats">
        <v-list-item-title>Generales</v-list-item-title>
      </v-list-item>
      <v-list-item @click.stop="statsByState">
        <v-list-item-title>Entidades</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DownloadStats',
  data() {
    return {};
  },
  methods: {
    stats() {
      const popupWindow = window.open(this.statsUrl, '_blank');
      popupWindow.focus();
    },
    statsByState() {
      const popupWindow = window.open(this.statsByStateUrl, '_blank');
      popupWindow.focus();
    }
  },
  computed: {
    ...mapState({
      statsUrl: state => state.statsUrl,
      statsByStateUrl: state => state.statsByStateUrl
    })
  }
};
</script>
