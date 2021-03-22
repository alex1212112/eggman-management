import request from '@/utils/request'

export function getInfo() {
  return request({
    url: 'admin/v2/info',
    method: 'get'
    // params: { token }
  })
}

export function getList(params) {
  return request({
    url: 'admin/v2/admin/list',
    method: 'get',
    params
  })
}

export function postAdd(data) {
  return request({
    url: 'admin/v2/admin',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/admin',
    method: 'put',
    data
  })
}

export function getScopes() {
  return request({
    url: 'admin/v2/scopes',
    method: 'get'
  })
}
