<template>
  <div class="flex">
    <div class="hidden lg:flex md:flex relative h-screen">
      <img
        src="@/assets/images/pages/loginbg.png"
        alt="login"
        width="630"
        class="w-11/12"
      />
      <router-link
        tag="div"
        to="/"
        class="cursor-pointer flex -mx-1 items-center absolute company-logo"
      >
        <img
          src="@/assets/images/logo/logo.svg"
          class="px-1 svg-white h-12"
        /><span class="px-1 text-white text-3xl font-bold">Videowiki</span>
      </router-link>
    </div>

    <div class="w-full md:w-1/2 lg:w-1/2 flex justify-center">
      <div class="px-8 register-tabs-container lg:w-2/3">
        <div class="vx-card__title mb-4">
          <h1 class="mb-base text-center"><b>Create Account</b></h1>
          <!--p style="color:#8692A6;" class="text-xl">Login with your social media accounts</p-->
        </div>
        <!--vs-divider class="text-xs mb-base">Or</vs-divider-->
        <register-jwt></register-jwt>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterJwt from './RegisterJWT.vue';

export default {
  components: {
    RegisterJwt
  }
};
</script>

<style lang="scss">
.register-tabs-container {
  min-height: 517px;
  padding-top: 1rem;
  .con-tab {
    padding-bottom: 23px;
  }
}
.svg-white {
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(130deg)
    brightness(106%) contrast(103%);
}
.company-logo {
  top: 5%;
  left: 10%;
}

/*.register-background img {
  position: absolute;
  left: 0;
  right: 0;
  width: 47%;
  height: 100%;
  overflow: hidden;
}*/
</style>

<!-- =========================================================================================
    File Name: Register.vue
    Description: Register Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<!--template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter">
            <div
              class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto register-background"
              vs-w="6"
            >
              <img src="@/assets/images/pages/register.png" alt="register" />
            </div>
            <div
              class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg"
              vs-w="6"
            >
              <div class="px-8 pt-8 register-tabs-container">
                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">Create Account</h4>
                  <p>Fill the below form to create a new account.</p>
                </div>

                <register-jwt></register-jwt>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import RegisterJwt from './RegisterJWT.vue';

export default {
  components: {
    RegisterJwt
  }
};
</script>

<style lang="scss">
.register-tabs-container {
  min-height: 517px;

  .con-tab {
    padding-bottom: 23px;
  }
}
.register-background img {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
}
</style-->
