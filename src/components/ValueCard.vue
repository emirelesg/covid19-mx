<template>
  <v-card elevation="4" :style="{ borderTop: `6px solid ${colorHex}` }">
    <v-list-item two-line class="text-center">
      <v-list-item-content class="py-4">
        <v-list-item-title class="display-1 mb-2" :style="{ color: colorHex }">
          <div v-if="value !== null">
            <slot :value="value">{{ value }}</slot>
          </div>
          <div v-else>—</div>
        </v-list-item-title>
        <v-list-item-subtitle class="text-uppercase subtitle-2">
          {{ title }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <!-- <v-sparkline
      :style="sparklineStyle"
      :gradient="[colorHex, '#efefef']"
      :padding="0"
      :line-width="2"
      :value="dataPoints"
      preserveAspectRatio="xMaxYMax meet"
      smooth
      stroke-linecap="round"
      auto-draw
    /> -->
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
    // dataPoints: Array
  },
  data() {
    return {};
  },
  computed: {
    colorHex() {
      return colors[this.color].base;
    }
    // sparklineStyle() {
    //   return {
    //     verticalAlign: 'top',
    //     position: 'absolute',
    //     padding: '8px 16px',
    //     bottom: 0,
    //     left: 0,
    //     right: 0,
    //     height: '75%',
    //     width: '100%'
    //   };
    // }
  }
};
</script>
