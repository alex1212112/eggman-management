import request from '@/utils/request'

export function putEdit(data) {
  return request({
    url: 'admin/v1/task',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'admin/v1/task',
    method: 'get',
    params
  })
}
