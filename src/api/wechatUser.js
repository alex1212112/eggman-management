import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v1/user',
    method: 'get',
    params
  })
}

export function getInfo(params) {
  return request({
    url: 'admin/v2/user/' + params,
    method: 'get'
  })
}
