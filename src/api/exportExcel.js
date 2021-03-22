import request from '@/utils/request'

export function downloadExcel(params) {
  return request({
    url: 'admin/v2/export/excel',
    method: 'get',
    responseType: 'blob',
    params
  })
}
