<template>
  <v-app-bar app color="primary" dark clipped-left hide-on-scroll>
    <v-app-bar-nav-icon @click.stop="TOGGLE_DRAWER" />
    <v-toolbar-title class="pl-2">
      <router-link :to="{ name: 'Home' }" class="white--text">
        COVID-19 en México
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <a target="_blank" href="https://udem.edu.mx/es">
      <v-img alt="Logo UDEM" width="75" contain src="@/assets/LogoUdem.png" />
    </a>
    <template v-slot:extension>
      <app-mode />
    </template>
  </v-app-bar>
</template>

<script>
import AppMode from '@/components/AppMode';
import { mapMutations } from 'vuex';

export default {
  name: 'AppHeader',
  components: {
    AppMode
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations(['TOGGLE_DRAWER'])
  }
};
</script>
