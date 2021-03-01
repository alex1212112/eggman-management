import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v2/mall/order',
    method: 'get',
    params
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/mall/order/express',
    method: 'put',
    data
  })
}

export function putInfo(data) {
  return request({
    url: 'admin/v2/mall/order',
    method: 'put',
    data
  })
}
