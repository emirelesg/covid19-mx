<template>
  <v-app>
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>COVID-19 en México</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {},

  data: () => ({
    //
  })
};
</script>
