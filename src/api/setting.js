import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'admin/v2/setting',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'admin/v2/setting',
    method: 'get',
    params
  })
}

