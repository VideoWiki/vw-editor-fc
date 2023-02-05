<!-- eslint-disable prettier/prettier -->
<template>
  <div v-if="haveLoginOptions">
	<h2 class="text-center">Sign in <strong>VideoWiki<br></strong></h2>
	<p class="mb-12 mt-2 text-center" style="color: black; font-size: 20px">Choose a account</p>
	<div class="">
	    <div v-for="(item,key,index) in loginOptions" class="w-full cursor-pointer flex border justify-between">
      <div @click="autoLogin(key,item.token)" class="con-img ml-3 my-1 pt-2 px-2">
        <vs-avatar
          :text="getFirstLetter(key)"
          color="primary"
          class="m-0 shadow-md"
          :src="activeUserInfo.profile_pic ? activeUserInfo.profile_pic : ''"
          size="40px"
        />
      </div>
      <div @click="autoLogin(key,item.token)" class="mt-2 px-8 w-10/12 h-full">
        <h5 class="w-full">{{ key }}</h5>
        <p>{{ item.name }}</p>
      </div>
      <div
      class="w-2/10 pt-2" @click="deleteUser(key)">
        <vs-tooltip text="Remove Account">
                              <span></span>
	                        <vs-icon
                            icon-pack="feather"
                            icon="icon-minus-circle"
                            class="cursor hover"
                            size="24px"
                            rounded="true"
                          >
                          </vs-icon>
                        </vs-tooltip>
      </div>
    </div>	
	</div>
  <div class="pt-0" >
  <p class="pt-4 font-semibold">   
    <span class="cursor-pointer" @click="haveLoginOptions= false">
    <vs-icon 
    icon-pack="feather"
    icon="icon-user"
    class="px-6 py-2"
    size="26px"
    rounded="rounded-lg"
    color="primary" >
    </vs-icon>
     Use other Account</span>
  </p>
  </div>
</div>
  <div v-else>
    <h2 class="heading">Choose VideoWiki <strong>login type</strong></h2>
    <div
      class="bar"
      :style="{
        '--color': currentButton.color,
        '--percentage': currentButton.percent,
      }"
    >
      <button
        v-for="(button, index) in buttons"
        :id="button.link"
        :key="button.link"
        shadow="sm"
        :title="button.text"
        pill
        :class="[
          currentValue === button.link
            ? 'active'
            : index < currentI
            ? 'preselected'
            : 'unselected',
        ]"
        :style="[
          currentValue === button.link ? { background: button.color } : {},
        ]"
        variant="#000"
        @click="nextStep(button.link)"
      />
    </div>
    <h3 :style="{ color: currentButton.color }">
      {{ currentButton.text }}
    </h3>
    <p style="color: black; font-size: 16px">
      {{ currentButton.description }}
    </p>
    <!-- login mode -->
    <div>
      <Restricted v-if="currentButton.percent == '0%'" />
      <Public v-else-if="currentButton.percent == '50%'" />
      <Private v-else />
    </div>
  </div>
</template>

<script>
import Private from './Private.vue';
import Public from './Public.vue';
import { utils } from '@/mixins/index';
import Restricted from './Restricted.vue';

export default {
  mixins: [utils],
  name: 'LoginModes',
  components: {
    Private,
    Restricted,
    Public,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    buttons: {
      type: Array,
      default: () => [
        {
          text: 'Web1',
          link: 'Login',
          color: '#DA9921',
          percent: '0%',
          description: 'Login using your Email & Password.',
        },
        {
          text: 'Web2',
          link: 'Google Login',
          color: '#4CD964',
          percent: '50%',
          description: 'Login using your Google Profile',
        },
        {
          text: 'Web3',
          link: 'Wallet Login',
          color: '#7247c4',
          percent: '100%',
          description: 'Login With Crypto Wallet',
        },
      ],
    },
    linkMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentButton: '',
      haveLoginOptions: false,
      loginOptions: JSON.parse(localStorage.getItem('otherAccount')),
      currentI: 0,
      proxyValue: '',
      msg: '',
    };
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
    currentValue() {
      if (this.linkMode) {
        return this.$route.name;
      }
      return this.proxyValue;
    },
  },
  watch: {
    proxyValue() {
      this.getcurrent();
      this.$emit('input', this.currentValue);
    },
    $route() {
      // doesnt colors the slider appropiately on using back/forward keys without this
      this.getcurrent();
    },
  },
  created() {
    if (!this.linkMode) {
      this.proxyValue = this.value;
    }
    this.haveLoginOptions =this.loginOptions && (Object.keys(this.loginOptions).length>0);
	console.log("have",JSON.stringify(this.loginOptions))
    this.getcurrent();
  },
  methods: {
    async deleteUser(user){
	this.$delete(this.loginOptions,user)
	if(Object.keys(this.loginOptions).length===0){
		this.haveLoginOptions = false
	}
	localStorage.setItem('otherAccount',JSON.stringify(this.loginOptions))
    },
    autoLogin(username,token) {
      var payload = {
        username: username,
        lc: this.$route.query.login_challenge,
	token: token
      };
      this.$vs.loading();
      this.$store
        .dispatch('auth/autoLogin', payload)
        .then((res) => {
          console.log(res.data);
          location.href = res.data.redirect_to;
          this.$vs.loading.close();
        })
        .catch((e) => {
          console.log(e);
          this.$vs.notify({
            title: 'Challenge Expired',
            text: 'Try Again',
            color: 'danger',
          });
          this.$vs.loading.close();
          location.href = constants.challengeUri;
        });
      // axios
      //   .get(
      //     `${constants.hydra_ep}/api/auto/login?username=${this.activeUserInfo.username}&login_challenge=${this.$route.query.login_challenge}`
      //   )
      //   .then((res) => {
      //     console.log(this.res);
      //   })
      //   .catch((e) => {
      //     console.log('e', e);
      //   });
    },
    nextStep(link) {
      if (this.linkMode) {
        this.$router.push(
          {
            name: link,
            query: { login_challenge: this.$route.query.login_challenge },
          },
          () => {
            this.proxyValue = link;
          }
        );
      } else {
        this.proxyValue = link;
      }
    },
    getcurrent() {
      for (let i = 0; i < this.buttons.length; i += 1) {
        const button = this.buttons[i];
        if (this.currentValue === button.link) {
          this.currentI = i;
          this.currentButton = button;
        }
      }
    },
  },
};
</script>

<style scoped>
button {
  border-radius: 15px;
  cursor: pointer;
}
.heading {
  font-weight: 500;
  font-size: 28px;
  text-align: left;
  margin-top: 2rem;
  margin-bottom: 3rem;
  color: black;
}
.preselected {
  background: var(--color);
  border-style: unset;
  height: 15px;
  width: 15px;
  padding: 0px;
}
.active {
  width: 25px;
  height: 25px;
  padding: 0px;
  border: 3px solid white;
  box-shadow: 0px 2px 8px rgba(243, 2, 0, 0.25);
}
.bar {
  background: linear-gradient(to right,var(--color, blue) var(--percentage),#d2d6d9 var(--percentage));
  display: flex;
  margin: 2rem 0;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: visible;
  width: 100%;
  height: 5px;
  margin-bottom: 3rem;
}
.unselected {
  height: 15px;
  width: 15px;
  padding: 0px;
  background-color: #d2d6d9;
  border: #d2d6d9;
}

.hover:hover{
	color: red;
}

.border{
padding-bottom: 8px;
border-bottom: 1px solid black;
}
</style>

<style lang="scss">
.tooltip {
  // ...

  &.popover {
    $color: #000;

    .popover-inner {
      background: $color;
      color: white;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }
}
.tooltip-arrow {
  z-index: 10000;
}
</style>
