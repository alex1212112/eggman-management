import { fetchDepartmentTree } from '@/api/department'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

import { createDepartmentRoutes } from '@/router/modules/department'
import departmentRouter from '@/router/modules/department'
// import basedataRouter from '@/router/modules/basedata'

const state = {
  departmentTree: null,
  departmentRoutes: []
}

const mutations = {
  SET_DEPARTMENT_TREE: (state, tree) => {
    state.departmentTree = tree
  },
  SET_DPARTMENT_ROUTES: (state, routes) => {
    state.departmentRoutes = routes
  }
}

const actions = {
  // get department tree
  getDepartmentTree({ commit, state }) {
    return new Promise((resolve, reject) => {
      fetchDepartmentTree()
        .then(response => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          commit('SET_DEPARTMENT_TREE', data)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // dynamically modify permissions
  async resetDepartmentRoutes({ commit, dispatch }) {
    const trees = await dispatch('getDepartmentTree')

    resetRouter()

    // generate accessible routes map based on roles
    // const accessRoutes = await dispatch('permission/generateRoutes', role_id, {
    //   root: true
    // })
    // dynamically add accessible routes
    const routes = createDepartmentRoutes(trees)
    commit('SET_DPARTMENT_ROUTES', routes)
    departmentRouter.children = routes
    departmentRouter.redirect = `${departmentRouter.path}/${routes[0].path}`
    router.addRoutes([departmentRouter])

    // reset visited views and cached views
    // dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
