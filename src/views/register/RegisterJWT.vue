<template>
  <div>
    <form>
      <div class="flex mb-6">
        <div class="w-1/2 mr-2">
          <h6 class="mb-4">First Name<span class="text-danger">*</span></h6>
          <input
            type="text"
            placeholder="Enter First Name"
            class="modified-input"
            autocomplete="off"
            v-model="firstName"
          />
        </div>
        <div class="w-1/2">
          <h6 class="mb-4">Last Name<span class="text-danger">*</span></h6>
          <input
            type="text"
            placeholder="Enter Last Name"
            class="modified-input"
            autocomplete="off"
            v-model="lastName"
          />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <h6 class="mb-4">Email<span class="text-danger">*</span></h6>
          <input
            type="email"
            placeholder="Enter email address"
            class="modified-input"
            autocomplete="off"
            v-model="email"
          />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <h6 class="mb-4">
            Create Password<span class="text-danger">*</span>
          </h6>
          <div class="flex relative">
            <input
              :type="create_showPassword ? 'text' : 'password'"
              placeholder="Enter password"
              class="modified-input"
              autocomplete="off"
              v-model="password"
            />
            <vs-icon
              :icon="create_showPassword ? 'visibility_off' : 'visibility'"
              class="input-icon"
              @click="create_showPassword = !create_showPassword"
              size="25px"
            />
          </div>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <h6 class="mb-4">
            Repeat Password<span class="text-danger">*</span>
          </h6>
          <div class="flex relative">
            <input
              :type="repeat_showPassword ? 'text' : 'password'"
              placeholder="Enter password"
              class="modified-input"
              autocomplete="off"
              v-model="confirm_password"
            />
            <vs-icon
              :icon="repeat_showPassword ? 'visibility_off' : 'visibility'"
              class="input-icon"
              @click="repeat_showPassword = !repeat_showPassword"
              size="25px"
            />
          </div>
        </div>
      </div>

      <vs-checkbox v-model="isTermsConditionAccepted" class="mt-6"
        >I accept the terms & conditions.</vs-checkbox
      >
      <div class="flex flex-wrap mb-3">
        <vs-button
          class="mt-6 flex-1 font-bold h-16"
          :disabled="!validateForm"
          @click.prevent="registerUserJWt"
        >
          Create Account</vs-button
        >
      </div>
    </form>
    <div class="flex flex-wrap mb-3 justify-center">
      <!--div class="flex-1"-->
      Do you already have an account?
      <span class="ml-1 text-primary cursor-pointer" @click="navigateToLogin"
        >Login</span
      >
      <!--/div-->
    </div>
  </div>
</template>

<script>
import constants from '../../../constant';
export default {
  props: {
    popup: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm_password: '',
      create_showPassword: false,
      repeat_showPassword: false,
      isTermsConditionAccepted: true,
    };
  },
  computed: {
    validateForm() {
      return (
        !this.errors.any() &&
        this.firstName !== '' &&
        this.lastName !== '' &&
        this.email !== '' &&
        this.password !== '' &&
        this.confirm_password !== '' &&
        this.isTermsConditionAccepted === true
      );
    },
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
  },
  methods: {
    registerUserJWt() {
      // If form is not validated or user is already login return
      console.log(1);
      if (!this.validateForm) return;

      this.$vs.loading();
      const payload = {
        userDetails: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirm_password,
        },
        notify: this.$vs.notify,
      };
      console.log(2);
      this.$store
        .dispatch('auth/registerUser', payload)
        .then((response) => {
          this.$vs.notify({
            time: 3000,
            title: 'Success',
            text: 'Registered Successfully',
            color: 'success',
          });
          location.href = constants.challengeUri;
        })
        .catch((error) => {
          this.$vs.loading.close();
          this.$vs.notify({
            title: 'Register Error',
            text: error.response.data.message,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger',
          });
        });
    },
    navigateToLogin() {
      if (this.popup) this.$emit('toLogin');
      else location.href = constants.challengeUri;
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
.input-icon {
  position: absolute;
  right: 5%;
  bottom: 30%;
  cursor: pointer;
}
</style>
