import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'admin/v2/agent',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/agent',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'admin/v2/agent',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'admin/v2/agent',
    method: 'delete',
    params
  })
}
