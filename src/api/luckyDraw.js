import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v2/luckyDraw',
    method: 'get',
    params
  })
}

export function getInfo(params) {
  return request({
    url: 'admin/v2/luckyDraw/' + params,
    method: 'get'
  })
}
