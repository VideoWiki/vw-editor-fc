<template>
  <div>
    <div class="divider mt-2 mb-2">
      <div class="divider-text p-0" />
    </div>

    <!-- connect to Social Accounts -->
    <div class="flex flex-wrap mt-6 w-full justify-center">
      <img
        src="@/assets/images/btn_google.png"
        @click.prevent="loginWithGoogle"
        class="btn mb-4 google-btn rounded-md"
      />
    </div>
  </div>
</template>

<script>
import constants from '../../../../constant';
import GAuth from 'vue-google-oauth2';
import Vue from 'vue';

export default {
  data() {
    return {
      constants,
      gAccessToken: '',
      required: false,
    };
  },
  props: {
    popup: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
  },
  mounted() {
    this.initilizeGAuth();
  },
  methods: {
    // Google Login
    initilizeGAuth() {
      console.log(0);
      const gauthOption = {
        clientId:
          '819083977574-sq0gi88sfdb5skebh2kjk62t41nuegfv.apps.googleusercontent.com',
        scope: 'profile email',
        prompt: 'consent',
        fetch_basic_profile: true,
      };
      Vue.use(GAuth, gauthOption);
    },
    async loginWithGoogle() {
      console.log(89);
      console.log(1);
      // Loading
      this.$vs.loading();
      try {
        console.log(2);
        const googleUser = await this.$gAuth.signIn();
        console.log(3);
        if (googleUser) {
          console.log(4);
          console.log(this.$route);
          this.gAccessToken = googleUser.getAuthResponse().access_token;
          console.log(this.gAccessToken);
          this.$store
            .dispatch('auth/sendAccessToken', {
              access_token: this.gAccessToken,
              login_type: 'web2',
              login_challenge: this.$route.query.login_challenge,
            })
            .then((response) => {
              console.log(5);
              window.location.replace(response.data.redirect_to);
              this.$acl.change(this.activeUserInfo.userRole);
              if (this.popup) this.$emit('loggedIn');
            });
        } else {
          console.log(6);
          this.$vs.notify({
            title: this.$t('Login.notify.title'),
            text: this.$t('GoogleLogin.notverified'),
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger',
          });
          this.$vs.loading.close();
        }
      } catch (error) {
        console.log(7);
        console.log(error, 'err');
        this.$vs.notify({
          title: this.$t('Login.notify.title'),
          text: 'User not verified',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger',
        });
        this.$vs.loading.close();
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');
.google-btn {
  border-radius: 6px;
  height: 60px;
  display: inline-flex !important;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.google-btn:hover {
  box-shadow: 0 4px 8px 0 rgba(175, 165, 165, 0.527);
}
.google-icon {
  width: 2rem;
  height: 2rem;
}

@media only screen and (max-width: 600px) {
  .google-icon > span {
    width: 10rem;
  }
}
</style>
