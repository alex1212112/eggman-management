import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v1/log',
    method: 'get',
    params
  })
}

export function getTypeList() {
  return request({
    url: 'admin/v1/logType',
    method: 'get'
  })
}
