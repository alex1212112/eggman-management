import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'admin/v2/lucky',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/lucky',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'admin/v2/lucky',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'admin/v2/lucky',
    method: 'delete',
    params
  })
}

export function postOnline(data) {
  return request({
    url: 'admin/v2/lucky/online',
    method: 'post',
    data
  })
}

export function postDown(data) {
  return request({
    url: 'admin/v2/lucky/down',
    method: 'post',
    data
  })
}

export function postPause(data) {
  return request({
    url: 'admin/v2/lucky/pause',
    method: 'post',
    data
  })
}

export function postReplay(data) {
  return request({
    url: 'admin/v2/lucky/replay',
    method: 'post',
    data
  })
}
