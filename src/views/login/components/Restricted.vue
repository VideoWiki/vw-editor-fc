<template>
  <div>
    <form class="mt-6" @submit="login">
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <div class="mb-4">
            <h6>{{ $t('Login.email') }}<span class="text-danger">*</span></h6>
            <div class="h-2">
              <span class="text-danger text-sm" v-show="errors.has('email')">{{
                errors.first('email')
              }}</span>
            </div>
          </div>
          <input
            v-validate="'required|email'"
            name="email"
            :placeholder="$t('Login.email_p')"
            class="modified-input"
            autocomplete="off"
            v-model="email"
          />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <h6 class="mb-4">
            {{ $t('Login.password') }}<span class="text-danger">*</span>
          </h6>
          <div class="flex relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              data-vv-validate-on="blur"
              v-validate="'required'"
              name="password"
              :placeholder="$t('Login.password_p')"
              class="modified-input"
              autocomplete="off"
              v-model="password"
            />
            <vs-icon
              :icon="showPassword ? 'visibility_off' : 'visibility'"
              class="input-icon"
              @click="showPassword = !showPassword"
              size="25px"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-wrap justify-between my-5" v-if="!popup">
        <vs-checkbox v-model="checkbox_remember_me" class="mb-3">{{
          $t('Login.remember')
        }}</vs-checkbox>
        <router-link to="/password/email">{{ $t('Login.forgot') }}</router-link>
      </div>
      <button style="display: none">submit</button>
      <div class="flex flex-wrap mb-3">
        <vs-button
          :disabled="!validateForm"
          @click.prevent="loginJWT"
          class="flex-1 font-bold h-16"
          >{{ $t('Login.login') }}</vs-button
        >
      </div>
    </form>
    <div class="flex flex-wrap mb-3 justify-center">
      {{ $t('Login.account') }}
      <span
        class="ml-1 text-primary cursor-pointer"
        @click="navigateToRegister"
        >{{ $t('Login.create') }}</span
      >
    </div>
  </div>
</template>

<script>
import constants from '../../../../constant';
import { utils } from '@/mixins/index';
// import axios from '../../../axios';

export default {
  mixins: [utils],
  data() {
    return {
      constants,
      email: '',
      password: '',
      checkbox_remember_me: false,
      showPassword: false,
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
    validateForm() {
      return !this.errors.any() && this.email !== '' && this.password !== '';
    },
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
  },

  methods: {
    login(e) {
      e.preventDefault();
      if (this.validateForm) {
        this.loginJWT();
      } else {
        this.$vs.notify({
          title: 'Fill all the details',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning',
        });
      }
    },
    loginJWT() {
      // Loading
      this.$vs.loading();
      const payload = {
        checkbox_remember_me: this.checkbox_remember_me,
        userDetails: {
          email: this.email,
          password: this.password,
        },
        params: {
          login_type: 'web1',
          login_challenge: this.$route.query.login_challenge,
        },
      };
      this.$store
        .dispatch('auth/login', payload)
        .then((response) => {
          this.$vs.loading();
          window.location.replace(response.data.redirect_to);
          this.$vs.loading.close();
          this.$vs.notify({
            title: 'Success',
            text: 'Login Successfull',
            iconPack: 'feather',
            color: 'success',
          });
        })
        .catch((error) => {
          console.log(error);
          window.location.href = constants.challengeUri;
          this.$vs.loading.close();
          if (
            error.response.data.message ===
              "user doesn't exist , register yourself" ||
            error.response.data.message === 'invalid Password!'
          )
            this.$vs.notify({
              time: 6000,
              title: 'Error',
              text: "User dosen't exist",
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger',
            });
          else {
            this.$vs.notify({
              time: 6000,
              title: 'Error',
              text: 'Something Went Wrong Try Again',
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger',
            });
          }
        });
    },
    registerUser() {
      if (!this.checkLogin()) return;
      this.$router.push('/register').catch(() => {});
    },
    navigateToRegister() {
      if (this.popup) this.$emit('toRegister');
      else this.$router.push('/register');
    },
  },
};
</script>
<style scoped>
.modified-input {
  height: 60px;
  border: none;
  background: #f3f3f3;
  font-family: Montserrat;
  border-radius: 4px;
  padding: 2rem;
  width: 100%;
}

.lHeight {
  margin: 8px 0 0 0;
}

.input-icon {
  position: absolute;
  right: 5%;
  bottom: 30%;
  cursor: pointer;
}
</style>
