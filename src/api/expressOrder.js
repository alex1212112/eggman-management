import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v2/order/express',
    method: 'get',
    params
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/order/express',
    method: 'put',
    data
  })
}

export function putInfo(data) {
  return request({
    url: 'admin/v2/order/expressInfo',
    method: 'put',
    data
  })
}
