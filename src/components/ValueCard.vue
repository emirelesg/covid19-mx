<template>
  <v-card elevation="4" :style="{ borderTop: `6px solid ${colorHex}` }">
    <v-list-item two-line class="text-center">
      <v-list-item-content class="py-4">
        <v-list-item-title class="display-1 mb-2" :style="{ color: colorHex }">
          {{ formattedValue }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-uppercase subtitle-2">
          {{ title }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import colors from 'vuetify/es5/util/colors';

export default {
  name: 'ValueCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      default: null
    },
    color: {
      type: String,
      default: 'grey'
    },
    isDelta: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    formattedValue() {
      if (this.value === null) return '-';
      if (this.isDelta && this.value > 0) return `+${this.value}`;
      return this.value;
    },
    colorHex() {
      if (this.value === null) {
        return colors.grey.base;
      } else {
        if (this.isDelta) {
          if (this.value > 0) return colors.red.base;
          if (this.value < 0) return colors.green.base;
        }
        return colors[this.color].base;
      }
    }
  }
};
</script>
