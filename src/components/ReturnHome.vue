<template>
  <v-btn @click.stop="goBack" color="primary" dark outlined>
    <v-icon left>mdi-arrow-left</v-icon>Regresar
  </v-btn>
</template>

<script>
export default {
  name: 'ReturnHome',
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'Home' });
    }
  }
};
</script>
