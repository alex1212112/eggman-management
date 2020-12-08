import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v1/order/pay',
    method: 'get',
    params
  })
}
