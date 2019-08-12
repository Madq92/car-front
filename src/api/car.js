import request from '@/utils/request'

export function carList(params) {
  return request({
    url: '/car',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/car',
    method: 'post',
    data
  })
}

export function edit(id, data) {
  return request({
    url: `/car/${id}`,
    method: 'put',
    data
  })
}

export function get(id) {
  return request({
    url: `/car/${id}`,
    method: 'get'
  })
}
