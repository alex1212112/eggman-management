import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/api/v1/workflow',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/api/v1/workflow',
    method: 'put',
    data
  })
}

export function remove(data) {
  return request({
    url: '/api/v1/workflow',
    method: 'DELETE',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/api/v1/workflow',
    method: 'get',
    params: query
  })
}
export function fetchWorkflowType(query) {
  return request({
    url: '/api/v1/workflow/type',
    method: 'get',
    params: query
  })
}
