import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v2/vipCash',
    method: 'get',
    params
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/vipCash',
    method: 'put',
    data
  })
}
