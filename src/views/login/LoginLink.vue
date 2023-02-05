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
import constant from '../../../constant';
export default {
  name: 'LoginLink',
  components: {},
  data() {
    return {
      alreadyLogged: false,
    };
  },
  computed: {
    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
  mounted() {
    window.location.href = constant.challengeUri;
  },
};
</script>
<style lang="scss" scoped></style>
