import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'admin/v2/role',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/role',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'admin/v2/role/list',
    method: 'get',
    params
  })
}

export function getAll(params) {
  return request({
    url: 'admin/v2/role/list/noPage',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'admin/v2/role',
    method: 'delete',
    params
  })
}

export function scopeList(params) {
  return request({
    url: 'admin/v2/scopes/list',
    method: 'get',
    params
  })
}

export function grantScope(params) {
  return request({
    url: 'admin/v2/role/scopes',
    method: 'post',
    params
  })
}
