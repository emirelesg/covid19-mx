<template>
  <v-app>
    <app-header/>
    <v-content class="pb-5">
      <router-view></router-view>
    </v-content>
    <app-footer/>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppFooter,
    AppHeader
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['loadData'])
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style>
svg {
  vertical-align: top;
}
a {
  text-decoration: none;
}
</style>
