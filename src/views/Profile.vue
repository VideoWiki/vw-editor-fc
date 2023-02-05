<template>
  <div>
    <TheHeader />
    <section class="lg:w-4/5 w-11/12">
      <vx-card>
        <template slot="no-body">
          <div class="card-header">
            <h1>{{ $t('Profile.profile') }}</h1>
          </div>
          <vs-divider class="m-0" />
          <div class="card-body">
            <h4 class="mb-3">{{ $t('Profile.avatar') }}</h4>
            <div
              class="flex flex-wrap items-end justify-center sm:justify-start"
            >
              <vs-avatar
                class="user-profile-img mr-4 vs-con-loading__container"
                id="display-profile-upload"
                color="primary"
                :text="getFirstLetter(userInfo.first_name)"
                :src="userInfo.profile_pic ? userInfo.profile_pic : null"
                size="70px"
              />
              <div>
                <input
                  type="file"
                  id="display-profile-input"
                  @change="uploadFile"
                  class="hidden"
                  accept="image/*"
                />
                <div
                  class="flex mb-4 justify-center sm:justify-start items-center"
                >
                  <vs-button
                    type="border"
                    class="mr-2"
                    :disabled="!editMode || uploadInProgress"
                    @click="openUpload"
                    >{{ $t('Profile.upload') }}</vs-button
                  >
                  <vs-button
                    type="flat"
                    size="large"
                    icon="delete"
                    color="danger"
                    :disabled="!editMode"
                    @click="removeDisplayProfile"
                  ></vs-button>
                </div>
                <p class="text-muted">
                  {{ $t('Profile.avatar_desc') }}
                </p>
              </div>
            </div>
            <vs-divider />
            <div class="vx-row">
              <div class="vx-col md:w-1/2 w-full mb-2">
                <vs-input
                  class="w-full"
                  :label="$t('Profile.name.first')"
                  :disabled="!editMode"
                  v-model="userInfo.first_name"
                />
              </div>
              <div class="vx-col md:w-1/2 w-full mb-2">
                <vs-input
                  class="w-full"
                  :label="$t('Profile.name.last')"
                  :disabled="!editMode"
                  v-model="userInfo.last_name"
                />
              </div>
              <div class="vx-col md:w-1/2 w-full mb-2">
                <vs-input
                  class="w-full"
                  :label="$t('Profile.name.user')"
                  :disabled="true"
                  v-model="userInfo.username"
                />
              </div>
              <div class="vx-col md:w-1/2 w-full mb-2">
                <vs-input
                  class="w-full"
                  :label="$t('Profile.email')"
                  disabled
                  v-model="userInfo.email"
                />
              </div>
            </div>
            <div class="flex justify-end">
              <vs-button type="filled" @click="handleProfileEdit">
                {{ editMode ? $t('Profile.save') : $t('Profile.edit') }}
              </vs-button>
            </div>
            <div>
              <h4 class="mb-2">{{ $t('Profile.password.reset') }}</h4>
              <form class="vx-row">
                <div class="vx-col md:w-1/3 w-full mb-2">
                  <label
                    >{{ $t('Profile.password.old')
                    }}<span class="text-danger">*</span></label
                  >
                  <vs-input
                    class="w-full"
                    type="password"
                    :name="`Old Password`"
                    v-validate="'required'"
                    autocomplete
                    v-model="oldPassword"
                    data-vv-as="password"
                  />
                  <span
                    class="text-danger text-sm"
                    v-show="errors.has(`Old Password`)"
                    >{{ errors.first(`Old Password`) }}</span
                  >
                </div>
                <div class="vx-col md:w-1/3 w-full mb-2">
                  <label
                    >{{ $t('Profile.password.new')
                    }}<span class="text-danger">*</span></label
                  >
                  <vs-input
                    class="w-full"
                    type="password"
                    :name="`New Password`"
                    ref="password"
                    v-validate="'required|min:6'"
                    autocomplete
                    v-model="newPassword"
                    data-vv-as="password"
                  />
                  <span
                    class="text-danger text-sm"
                    v-show="errors.has(`New Password`)"
                    >{{ errors.first(`New Password`) }}</span
                  >
                </div>
                <div class="vx-col md:w-1/3 w-full mb-2">
                  <label
                    >{{ $t('Profile.password.confirm') }}d<span
                      class="text-danger"
                      >*</span
                    ></label
                  >
                  <vs-input
                    class="w-full"
                    type="password"
                    :name="`Confirm Password`"
                    v-validate="'required|min:6|confirmed:password'"
                    autocomplete
                    v-model="confirmPassword"
                    data-vv-as="password"
                  />
                  <span
                    class="text-danger text-sm"
                    v-show="errors.has(`Confirm Password`)"
                    >{{ errors.first(`Confirm Password`) }}</span
                  >
                </div>
              </form>
              <div class="flex justify-end">
                <vs-button type="filled" @click="resetPassword">
                  {{ $t('Profile.update') }}
                </vs-button>
              </div>
            </div>
          </div>
        </template>
      </vx-card>
    </section>
  </div>
</template>
<script>
import TheHeader from '@/layouts/components/navbar/TheNavbarHorizontal';
import { ajaxCallMixin } from '@/http/HttpCommon';
import { utils } from '@/mixins/index';
import constants from '../../constant';

export default {
  name: 'Profile',
  mixins: [ajaxCallMixin, utils],
  components: {
    TheHeader,
  },
  data() {
    return {
      userInfo: {},
      editMode: false,
      uploadInProgress: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      uploadedImageBlob: null,
    };
  },
  mounted() {
    this.userInfo = { ...this.$store.state.AppActiveUser };
    console.log(this.userInfo);
  },
  methods: {
    openUpload() {
      document.getElementById('display-profile-input').click();
    },
    uploadFile(event) {
      const selectedFile = event.target.files[0];
      this.uploadedImageBlob = selectedFile;
      this.userInfo.profile_pic = URL.createObjectURL(selectedFile);
      console.log(this.userInfo);
      event.target.value = '';
    },
    removeDisplayProfile() {
      this.userInfo = { ...this.userInfo, profile_pic: '' };
      this.uploadedImageBlob = null;
    },
    logout() {
      this.$cookies.remove('userId');
      this.$cookies.remove('Token');

      localStorage.clear();
      return this.$store.dispatch('auth/logOut');
    },
    handleProfileEdit() {
      if (!this.editMode) {
        this.editMode = true;
      } else {
        this.$vs.loading();
        const payload = {
          fname: this.userInfo.first_name,
          lname: this.userInfo.last_name,
          user_name: this.userInfo.username,
          p_image: this.uploadedImageBlob ? this.uploadedImageBlob : '',
          email: this.userInfo.email,
        };
        this.$store
          .dispatch('auth/updateUserDetails', payload)
          .then((res) => {
            console.log(1);
            this.editMode = false;
            console.log(2);
            this.userInfo.profile_pic = res.data.profile_image;
            console.log(3);
            this.$store.commit('UPDATE_USER_INFO', this.userInfo);
            console.log(4);
            this.$vs.notify({
              title: 'Success',
              text: 'Changes Saved',
              color: 'success',
            });
            this.logout();
          })
          .catch(() => {
            this.$vs.notify({
              title: 'Error',
              text: 'Error Saving Details',
              color: 'danger',
            });
          })
          .finally(() => {
            this.$vs.loading.close();
          });
      }
    },
    resetPassword() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          const data = {};
          data.current_password = this.oldPassword;
          data.new_password = this.newPassword;
          data.confirm_password = this.confirmPassword;
          this.$vs.loading();
          this.$store
            .dispatch('auth/changePassword', data)
            .then(() => {
              this.$vs.notify({
                title: 'Success',
                text: 'Password updated successfully',
                color: 'success',
              });
              this.oldPassword = '';
              this.newPassword = '';
              this.confirmPassword = '';
              this.$validator.reset();
              this.logout();
            })
            .catch((error) => {
              this.$vs.notify({
                title: 'Error',
                text: error.response.data.message,
                color: 'danger',
              });
            })
            .finally(() => {
              this.$vs.loading.close();
            });
        }
      });
    },
  },
};
</script>
<style scoped>
section {
  padding: 4rem 0;
  margin: auto;
}
.card-header,
.card-body {
  padding: 2rem;
}
form label {
  font-size: 0.8rem;
}
</style>
