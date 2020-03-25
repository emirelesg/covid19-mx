<template>
  <v-card
    elevation="4"
    :style="{ borderTop: `6px solid ${borderColor}`}"
    class="pa-1"
  >
    <div
      v-if="updatedOn"
      class="pt-1 pr-3 caption text-right grey--text text--darken-3"
      style="position: absolute; right: 0"
    >
      <div>Actualizado al</div>
      <div>{{ updatedOn }}</div>
    </div>
    <v-list-item two-line class="text-center">
      <v-list-item-content>
        <v-list-item-title
          class="display-1 mb-2"
          :style="{ color: textColor }"
        >{{ value === null ? '—' : value }}</v-list-item-title>
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
    color: String,
    shade: String,
    updatedOn: String
  },
  data() {
    return {};
  },
  computed: {
    textColor: function() {
      return colors[this.color][this.shade || 'base'];
    },
    borderColor: function() {
      return colors[this.color].base;
    }
  }
};
</script>
