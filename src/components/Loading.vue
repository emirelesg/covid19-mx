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
  name: 'loading',
  props: {
    message: { type: String, required: true },
    height: { type: String, default: 'calc(100vh - 88px)' }
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
