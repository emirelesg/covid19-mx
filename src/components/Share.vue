<template>
  <div>
    <v-btn
      class="mx-2"
      @click="share(network.url)"
      icon
      color="primary"
      v-for="network in networks"
      :key="network.icon"
    >
      <v-icon>{{ network.icon }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Share',
  data() {
    return {
      url: 'https://covid19.newtondreams.com/',
      title: 'COVID-19 en México',
      networks: [
        {
          icon: 'mdi-facebook',
          url: 'https://www.facebook.com/sharer/sharer.php?u=@url&title=@title'
        },
        {
          icon: 'mdi-twitter',
          url: 'https://twitter.com/intent/tweet?text=@title&url=@url'
        },
        {
          icon: 'mdi-linkedin',
          url:
            'https://www.linkedin.com/shareArticle?mini=true&url=@url&title=@title'
        }
      ]
    };
  },
  methods: {
    share(url) {
      const formatted = url
        .replace(/@url/g, encodeURIComponent(this.url))
        .replace(/@title/g, encodeURIComponent(this.title));
      const popupWindow = window.open(
        formatted,
        '_blank',
        'status=no' + 'scrollbars=no'
      );
      popupWindow.focus();
    }
  }
};
</script>
