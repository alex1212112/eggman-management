import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v2/real/list',
    method: 'get',
    params
  })
}
