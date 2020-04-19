<template>
  <v-btn @click.stop="open" color="primary" dark outlined>
    <v-icon left>mdi-download</v-icon>Datos
  </v-btn>
</template>

<script>
export default {
  name: 'DownloadStats',
  data() {
    return {};
  },
  methods: {
    open() {
      const popupWindow = window.open('/api/stats.json', '_blank');
      popupWindow.focus();
    }
  }
};
</script>
