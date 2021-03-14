import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v2/egg/log',
    method: 'get',
    params
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/egg/log',
    method: 'post',
    data
  })
}

export function putInfo(data) {
  return request({
    url: 'admin/v1/order/expressInfo',
    method: 'put',
    data
  })
}
