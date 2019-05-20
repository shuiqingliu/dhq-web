import request from '@/utils/request'

export function fetchList(params){
    return request({
        url: '/OrderOffline/showCondition',
        method: 'get',
        params: params
    })
}

export function getStore(params){
    return request({
        url: '/OrderOffline/listShopsOfRegion',
        method: 'get',
        params: params
    })
}
//获取门店昨天统计信息
export function getYesterdayData(params){
    return request({
        url: '/OrderOffline/getOfflineOrderOfYesterday',
        method: 'get',
        params: params
    })
}
//获取门店前30天信息
export function getMonthData(params){
    return request({
        url: '/OrderOffline/getOfflineOrderOfThirtyDays',
        method: 'get',
        params: params
    })
}

//获取线上课昨天统计信息
export function getYesterdayData2(){
    return request({
        url: '/OrderOnline/getOrderNumOfYesterday',
        method: 'get',
    })
}
//获取先上课前30天信息
export function getMonthData2(){
    return request({
        url: '/OrderOnline/getOrderOfLastMonth',
        method: 'get',
    })
}
//获取线上订单详情
export function getOnlineDetail(params){
    return request({
        url: '/OrderOnline/getOrderBetweenTwoDate',
        method: 'get',
        params:params
    })
}
//获取线下订单详情
export function getOfflineDetail(params){
    return request({
        url: '/OrderOffline/getOrderBetweenTwoDateWithShopID',
        method: 'get',
        params:params
    })
}

