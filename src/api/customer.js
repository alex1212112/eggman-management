import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/customer',
    method: 'get',
    params: query
  })
}

export function createCustomer(data) {
  return request({
    url: '/api/v1/customer',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: '/api/v1/customer',
    method: 'put',
    data
  })
}

export function removeCustomer(data) {
  return request({
    url: '/api/v1/customer',
    method: 'DELETE',
    data
  })
}
