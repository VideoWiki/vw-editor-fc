<template>
  <div id="loading-bg">
    <div class="loading-logo">
      <img src="@/../public/logo.svg" alt="Logo" />
    </div>
    <div class="loading">
      <div class="effect-1 effects"></div>
      <div class="effect-2 effects"></div>
      <div class="effect-3 effects"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'saveInfo',
  components: {},
  data() {
    return {};
  },
  computed: {
    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
  mounted() {
    var AccountList = JSON.parse(localStorage.getItem('otherAccount'));
    if (!AccountList) {
      AccountList = {};
    }
    AccountList[this.$route.query.username] = {
      token: this.$route.query.token,
      name: this.$route.query.name,
    };
    localStorage.setItem('otherAccount', JSON.stringify(AccountList));
    switch (this.$route.query.origin) {
      case 'editor':
        location.href = 'https://dev.stream.video.wiki';
        break;
      case 'cast':
        location.href = 'https://dev.cast.video.wiki';
        break;
      default:
        alert('Wrong Origin');
    }
  },
};
</script>
<style lang="scss" scoped></style>
