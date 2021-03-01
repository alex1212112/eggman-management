import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'admin/v2/mall/goods',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/mall/goods',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'admin/v2/mall/goods',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'admin/v2/mall/goods',
    method: 'delete',
    params
  })
}
