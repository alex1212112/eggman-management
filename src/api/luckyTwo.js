import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'admin/v2/lucky/two',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'admin/v2/lucky/two',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'admin/v2/lucky/two',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'admin/v2/lucky/two',
    method: 'delete',
    params
  })
}

export function postOnline(data) {
  return request({
    url: 'admin/v2/lucky/two/online',
    method: 'post',
    data
  })
}

export function postDown(data) {
  return request({
    url: 'admin/v2/lucky/two/down',
    method: 'post',
    data
  })
}

export function postPause(data) {
  return request({
    url: 'admin/v2/lucky/two/pause',
    method: 'post',
    data
  })
}

export function postReplay(data) {
  return request({
    url: 'admin/v2/lucky/two/replay',
    method: 'post',
    data
  })
}
