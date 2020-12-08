import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v1/order/express',
    method: 'get',
    params
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v1/order/express',
    method: 'put',
    data
  })
}
