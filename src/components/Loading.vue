<template>
  <v-container fill-height :style="style">
    <v-row no-gutters justify="center" class="text-center">
      <v-col cols="12">
        <v-progress-circular
          indeterminate
          :size="48"
          :width="3"
          color="primary"
          class="mb-4"
        ></v-progress-circular>
        <p class="ma-0">{{ message }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    message: {
      type: String,
      default: 'Cargando...'
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {};
  },
  computed: {
    style() {
      return {
        height: this.height
      };
    }
  }
};
</script>
