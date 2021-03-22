import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/v2/log',
    method: 'get',
    params
  })
}

export function getTypeList() {
  return request({
    url: 'admin/v2/logType',
    method: 'get'
  })
}
