<template>
  <v-app-bar app color="primary" dark clipped-left>
    <v-app-bar-nav-icon @click.stop="TOGGLE_DRAWER" />
    <v-toolbar-title>
      <router-link :to="{ name: 'Home' }" class="white--text">
        COVID-19 en México
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <a href="https://udem.edu.mx/es">
      <v-img alt="Logo UDEM" width="75" contain src="@/assets/LogoUdem.png" />
    </a>
  </v-app-bar>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'AppHeader',
  data() {
    return {};
  },
  methods: {
    ...mapMutations(['TOGGLE_DRAWER'])
  }
};
</script>
