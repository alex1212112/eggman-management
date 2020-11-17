import { login, logout, getInfo, createUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  nickname: '',
  realName: '',
  avatar: '',
  introduction: '',
  roles: [],
  id: '',
  roleId: '',
  phone: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NICKNAME: (state, name) => {
    state.nickname = name
  },
  SET_REALNAME: (state, name) => {
    state.realName = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_ROLEID: (state, id) => {
    state.roleId = id
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.access_token)
          setToken(data.access_token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { role_id, nickname, real_name, phone, id, avatar } = data

          // roles must be a non-empty array
          // if (!roles || roles.length <= 0) {
          //   reject('getInfo: roles must be a non-null array!')
          // }

          // commit('SET_ROLES', roles)
          commit('SET_NICKNAME', nickname)
          commit('SET_REALNAME', real_name)
          commit('SET_ID', id)
          commit('SET_ROLEID', role_id)
          commit('SET_AVATAR', avatar)
          // commit('SET_INTRODUCTION', introduction)
          commit('SET_PHONE', phone)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          // commit('SET_ROLES', [])
          commit('SET_NICKNAME', '')
          commit('SET_REALNAME', '')
          commit('SET_ID', '')
          commit('SET_ROLEID', '')
          commit('SET_AVATAR', '')
          commit('SET_PHONE', '')
          removeToken()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      // commit('SET_ROLES', [])
      commit('SET_NICKNAME', '')
      commit('SET_REALNAME', '')
      commit('SET_ID', '')
      commit('SET_ROLEID', '')
      commit('SET_AVATAR', '')
      commit('SET_PHONE', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { role_id } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', role_id, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  },

  createUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      createUser(data)
        .then((res) => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
