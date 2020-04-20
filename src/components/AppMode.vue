<template>
  <div class="pl-0">
    <v-tabs
      @change="SET_MODE_BY_IDX"
      :value="currentMode"
      background-color="transparent"
      v-if="$vuetify.breakpoint.smAndUp"
    >
      <v-tab v-for="(mode, i) in modes" :key="`tab-${i}`">
        {{ mode.title }}
      </v-tab>
    </v-tabs>
    <v-menu v-else offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text class="align-self-center mr-4" v-on="on">
          {{ modes[currentMode].title }}
          <v-icon right>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list class="grey lighten-3">
        <v-list-item
          v-for="(mode, i) in modes"
          :key="`menu-${mode.key}`"
          @click="SET_MODE_BY_IDX(i)"
        >
          {{ mode.title }}
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { modes } from '@/plugins/helper';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'AppMode',
  data() {
    return {
      modes
    };
  },
  methods: {
    ...mapMutations(['SET_MODE_BY_IDX'])
  },
  computed: {
    ...mapState({
      currentMode: state => state.modeIdx
    })
  }
};
</script>
