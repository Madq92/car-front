import request from '@/utils/request'

export function openCity() {
  return request({
    url: '/cbs/openCity',
    method: 'get'
  })
}

export function order(data) {
  return request({
    url: '/cbs/order',
    method: 'post',
    data
  })
}

export function reportUrl(carId) {
  return request({
    url: `/cbs/reportUrl/${carId}`,
    method: 'get'
  })
}

export function synOrder(carId) {
  return request({
    url: `/cbs/synOrder/${carId}`,
    method: 'get'
  })
}
