import { login, logout, getMyInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {
    id: '',
    name: '',
    phone: '',
    avatar: ''
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: username.trim(), password: password }).then(response => {
        const { body } = response
        commit('SET_TOKEN', body.token)
        commit('SET_USER_INFO', body)
        setToken(body.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getMyInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getMyInfo().then(response => {
        const { body } = response
        commit('SET_USER_INFO', body)
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

