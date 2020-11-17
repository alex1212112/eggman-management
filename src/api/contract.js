import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/api/v1/contract',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'api/v1/contract',
    method: 'put',
    data
  })
}

export function remove(data) {
  return request({
    url: 'api/v1/contract',
    method: 'DELETE',
    data
  })
}

export function fetchList(query) {
  return request({
    url: 'api/v1/contract',
    method: 'get',
    params: query
  })
}