import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'admin/v1/lucky',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v1/lucky',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'admin/v1/lucky',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'admin/v1/lucky',
    method: 'delete',
    params
  })
}

export function postOnline(data) {
  return request({
    url: 'admin/v1/lucky/online',
    method: 'post',
    data
  })
}

export function postDown(data) {
  return request({
    url: 'admin/v1/lucky/down',
    method: 'post',
    data
  })
}

export function postPause(data) {
  return request({
    url: 'admin/v1/lucky/pause',
    method: 'post',
    data
  })
}

export function postReplay(data) {
  return request({
    url: 'admin/v1/lucky/replay',
    method: 'post',
    data
  })
}
