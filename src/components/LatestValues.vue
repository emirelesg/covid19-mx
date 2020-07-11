<template>
  <v-row>
    <v-col cols="6" sm="3" md="3" v-for="(v, i) in values" :key="`value-${i}`">
      <v-tooltip
        bottom
        max-width="300"
        :disabled="!v.help"
        color="rgba(50, 50, 50, 0.9)"
      >
        <template v-slot:activator="{ on }">
          <!-- <v-hover v-slot:default="{ hover }" :disabled="!v.help"> -->
          <v-card
            v-on="on"
            elevation="0"
            outlined
            :style="{ borderTop: `6px solid ${getColor(v)}` }"
          >
            <v-icon
              v-if="!!v.help"
              style="position: absolute; right: 10px; top: 10px"
              color="grey"
            >
              mdi-information-outline
            </v-icon>
            <v-list-item two-line class="text-center">
              <v-list-item-content class="py-4">
                <v-list-item-title
                  class="mb-2"
                  :style="{
                    color: getColor(v),
                    'font-size': $vuetify.breakpoint.xsOnly
                      ? '1.875rem'
                      : '2.125rem'
                  }"
                >
                  {{ getValue(v) }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-uppercase subtitle-2">
                  {{ v.title }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <!-- </v-hover> -->
        </template>
        <span>{{ v.help }}</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
import colors from 'vuetify/es5/util/colors';
import { values } from '@/plugins/helper';
import { mapState } from 'vuex';

export default {
  name: 'LatestValues',
  props: {
    loaded: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      values
    };
  },
  methods: {
    getValue(v) {
      if (this.loaded) {
        const val = v.value(this.latest);
        if (v.delta && val > 0) return `+${val.toLocaleString()}`;
        return val.toLocaleString();
      }
      return '-';
    },
    getColor(v) {
      if (this.loaded) {
        // if (v.delta)
        // return v.value(this.latest) > 0 ? colors.red.base : colors.green.base;
        return v.color;
      }
      return colors.grey.base;
    }
  },
  computed: {
    ...mapState({
      latest: state => state.latest
    })
  }
};
</script>
