/* eslint-disable prefer-promise-reject-errors */
import { reject } from 'core-js/fn/promise';
import constants from '../../../constant.js';
import jwt from '../../http/requests/auth/jwt/index.js';

export default {
  login({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .login(
          payload.userDetails.password,
          payload.userDetails.email,
          payload.params.login_challenge
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  registerUser({ commit }, payload) {
    const { firstName, lastName, email, password, confirmPassword } =
      payload.userDetails;

    return new Promise((resolve, reject) => {
      // Check confirm password
      if (password !== confirmPassword) {
        reject({ message: "Password doesn't match. Please try again." });
      }

      jwt
        .registerUser(firstName, lastName, email, password)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  logOut({ commit }) {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('accessToken');
    // find a way to logout without refresh
    commit('LOGOUT', null, { root: true });
    location.href = constants.challengeUri;
  },
  autoLogin({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .autoLogin(payload)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  updateUserDetails({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .updateUser(payload)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  changePassword({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .changePassword(payload)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchUser({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('UPDATE_USER_INFO', payload, { root: true });
      commit('SET_BEARER', payload.access_token);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'register',
        authenticationMethod: 'Email',
        userId: payload.id,
      });
      resolve(true);
    });
  },
  sendAccessToken({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .generateAccessToken(payload)
        .then((response) => {
          resolve(response);
          // If there's user data in response
          if (response.data.usersData) {
            const userData = response.data.usersData;
            commit('UPDATE_USER_INFO', userData, { root: true });

            commit('SET_BEARER', response.data.accessToken);
          } else {
            reject({ message: 'Wrong Email or Password' });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fetchAccessToken({ commit }) {
    return new Promise((resolve) => {
      jwt.refreshToken().then((response) => {
        commit('SET_BEARER', response.data.access_token);
        resolve(response);
      });
    });
  },
  // for Metamask
  getNonce({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .generateNonce(payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sendSignature({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .verifySignature(payload)
        .then((response) => {
          console.log('response');
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sendResetEmail({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .sendResetEmail(payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  resetPassword({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .resetPassword(payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
