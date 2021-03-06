import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/v1/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/v1/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/v1/logout',
    method: 'post'
  })
}

export function createUser(data) {
  return request({
    url: '/admin/v1/user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/api/v1/user',
    method: 'put',
    data
  })
}

export function removeUser(data) {
  return request({
    url: '/api/v1/user',
    method: 'DELETE',
    data
  })
}

export function fetchUserList(query) {
  return request({
    url: '/api/v1/userList',
    method: 'get',
    params: query
  })
}

export function fetchUserAll(query) {
  return request({
    url: '/api/v1/userAll',
    method: 'get',
    params: query
  })
}
