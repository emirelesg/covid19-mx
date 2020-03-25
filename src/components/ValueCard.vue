<template>
  <v-card elevation="4" :style="cardStyle" class="pa-1">
    <v-list-item two-line class="text-center">
      <v-list-item-content>
        <v-list-item-title class="display-1 mb-2" :style="style">
          <div v-if="value !== null">
            <slot :value="value">{{ value }}</slot>
          </div>
          <div v-else>—</div>
        </v-list-item-title>
        <v-list-item-subtitle class="text-uppercase subtitle-2">{{ title }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import colors from 'vuetify/es5/util/colors';

export default {
  name: 'ValueCard',
  props: {
    title: String,
    value: Number,
    color: String
  },
  data() {
    return {};
  },
  computed: {
    style: function() {
      return {
        color: colors[this.color].base
      };
    },
    cardStyle: function() {
      return {
        borderTop: `6px solid ${colors[this.color].base}`
      };
    }
  }
};
</script>
