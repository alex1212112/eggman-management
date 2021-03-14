import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'admin/v2/lucky/week',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/lucky/week',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'admin/v2/lucky/week',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'admin/v2/lucky/week',
    method: 'delete',
    params
  })
}

export function postOnline(data) {
  return request({
    url: 'admin/v2/lucky/week/online',
    method: 'post',
    data
  })
}

export function postDown(data) {
  return request({
    url: 'admin/v2/lucky/week/down',
    method: 'post',
    data
  })
}

export function postPause(data) {
  return request({
    url: 'admin/v2/lucky/week/pause',
    method: 'post',
    data
  })
}

export function postReplay(data) {
  return request({
    url: 'admin/v2/lucky/week/replay',
    method: 'post',
    data
  })
}
