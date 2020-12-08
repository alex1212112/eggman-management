import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'admin/v1/categories',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v1/categories',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'admin/v1/categories',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'admin/v1/categories',
    method: 'delete',
    params
  })
}
