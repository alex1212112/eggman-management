import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v2/luckyDrawWeek',
    method: 'get',
    params
  })
}

export function getInfo(params) {
  return request({
    url: 'admin/v2/luckyDrawWeek/' + params,
    method: 'get'
  })
}
