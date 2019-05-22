import request from '@/utils/request'

export function fetchList(listQuery) {
  return request({
    url: 'pcs-scale/scale/management',
    // url: 'scale/management',
    method: 'get',
    // params: { scaleIndistinctName }
    params: listQuery
  })
}

export function updateScaleState(scaleId, status) {
  return request({
    url: 'pcs-scale/scale/update-scale-status',
    // url: 'scale/update-scale-status',
    method: 'post',
    data: {scaleId, status}
  })
}

export function fetchListByScaleId(scaleId) {
  return request({
    url: 'pcs-scale/scale/acquire-scale-info-by-scale-id',
    // url: 'scale/acquire-scale-info-by-scale-id',
    method: 'get',
    params: {scaleId}
  })
}

export function submitScale(data) {
  return request({
    url: 'pcs-scale/scale/submit-new-scale',
    // url: 'scale/submit-new-scale',
    method: 'post',
    data:data
  })
}

export function fetchArticle(id) {
  return request({
    url: 'pcs-scale/article/detail',
    method: 'get',
    params: { id }
  })
}


export function fetchPv(pv) {
  return request({
    url: 'pcs-scale/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: 'pcs-scale/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: 'pcs-scale/article/update',
    method: 'post',
    data
  })
}
