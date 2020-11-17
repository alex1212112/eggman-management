import request from '@/utils/request'

export function fetchDepartmentTree(query) {
  return request({
    url: '/api/v1/departmentTree',
    method: 'get',
    params: query
  })
}

export function fetchDepartmentUser(query) {
  return request({
    url: '/api/v1/departmentUser',
    method: 'get',
    params: query
  })
}

export function updateDepartmentUser(data) {
  return request({
    url: '/api/v1/departmentUser',
    method: 'post',
    data: data
  })
}

// export function fetchPv(pv) {
//   return request({
//     url: '/vue-element-admin/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

// export function createArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/create',
//     method: 'post',
//     data
//   })
// }

// export function updateArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/update',
//     method: 'post',
//     data
//   })
// }
