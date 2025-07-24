import request from '@/utils/request'

export function statUser(query) {
  return request({
    url: '/stat/user',
    method: 'get',
    params: query
  })
}

export function statOrder(query) {
  return request({
    url: '/stat/order',
    method: 'get',
    params: query
  })
}

export function statGoods(query) {
  return request({
    url: '/stat/goods',
    method: 'get',
    params: query
  })
}

export function statUserOrder(query) {
  return request({
    url: '/stat/userOrder',
    method: 'get',
    params: query
  })
}

export function statGrabOrder(query) {
  return request({
    url: '/stat/grabOrder',
    method: 'get',
    params: query
  })
}
