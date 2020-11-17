import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/subcontractor',
    method: 'get',
    params: query
  })
}

export function fetchAll(query) {
  return request({
    url: '/api/v1/subcontractorAll',
    method: 'get',
    params: query
  })
}

export function createSubcontractor(data) {
  return request({
    url: '/api/v1/subcontractor',
    method: 'post',
    data
  })
}

export function updateSubcontractor(data) {
  return request({
    url: '/api/v1/subcontractor',
    method: 'put',
    data
  })
}

export function removeSubcontractor(data) {
  return request({
    url: '/api/v1/subcontractor',
    method: 'delete',
    data
  })
}

