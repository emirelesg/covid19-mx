<template>
  <v-navigation-drawer @input="SET_DRAWER" :value="drawer" app clipped>
    <v-list dense>
      <v-subheader>PAÍS</v-subheader>
      <v-list-item link :to="{ name: 'Home' }" color="primary" exact>
        <v-list-item-title>Inicio</v-list-item-title>
      </v-list-item>
      <v-subheader>ENTIDADES</v-subheader>
      <v-list-item-group color="primary">
        <v-list-item
          link
          :to="{ name: 'State', params: { stateKey: stateKey.toLowerCase() } }"
          v-for="[stateKey, stateName] in states"
          :key="stateKey"
          exact
        >
          <v-list-item-title>{{ stateName }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { stateNames } from '@/plugins/helper';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'AppNavigation',
  data() {
    return {
      states: Object.entries(stateNames).sort(([, a], [, b]) =>
        a.localeCompare(b)
      )
    };
  },
  methods: {
    ...mapMutations(['SET_DRAWER'])
  },
  computed: {
    ...mapState({
      drawer: state => state.drawer
    })
  }
};
</script>
