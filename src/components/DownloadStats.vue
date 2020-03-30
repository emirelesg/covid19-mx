<template>
  <v-btn @click="open" color="primary" dark outlined>
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
      const popupWindow = window.open(
        'https://github.com/emirelesg/covid19-mx/blob/master/src/assets/MexicoStats.json',
        '_blank'
      );
      popupWindow.focus();
    }
  }
};
</script>
