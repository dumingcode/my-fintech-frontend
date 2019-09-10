const http = require('../utils/http');

module.exports = {
    // 查询中信一级行业
    queryCitiFstIndustryInfo: (data) => { return http.get('api/bigdata/queryCitiFstIndustryInfo.json', data) },
    // 查询中信二级行业
    queryCitiSndIndustryInfo: (data) => { return http.get('api/bigdata/queryCitiSndIndustryInfo.json', data) },
    // 批量查询个股所属一二级行业
    queryStockIndInfo: (data) => { return http.get(`api/bigdata/queryStockIndInfo.json?codes=${data}`, data) },
    // 查询个股相对沪深300的alpha和beta
    queryStockAlphaBeta: (data) => { return http.get('api/stockQuant/queryStockAlphaBeta.json', data) },
    // 查询用户信息
    queryUserInfo: (data) => { return http.get('api/user/queryUserInfo.json', data) },
    // 测试登陆
    loginTest: (data) => { return http.get('api/auth/loginTest.json', data) },
    // 退出登陆
    logout: (data) => { return http.get('api/user/logout.json', data) },
    // 查询用户的自选股代码列表
    queryOptStocks: (data) => { return http.get('api/user/queryOptStocks.json', data) },
    // 查询用户设定的个股止盈补仓数据
    queryOptStockDealDetail: (data) => { return http.get('api/user/queryOptStockDealDetail.json', data) },
    // 保存用户输入的自选股代码
    saveOptStocks: (data) => { return http.post('api/user/saveOptStocks.json', data, false) },
    // 保存用户设定的个股止盈止损信息
    saveOptStockDealDetail: (data) => { return http.post('api/user/saveOptStockDealDetail.json', data, false) },
    // 删除用户设定的个股止盈止损信息
    delOptStockDealDetail: (data) => { return http.delete('api/user/delOptStockDealDetail.json', data, false) },
    // 本地用户登陆
    loginLocal: (data) => { return http.post('api/auth/loginLocal.json', data, false) },
    // 查询新浪实时行情信息
    querySinaStockGet: (data) => { return http.get('api/bigdata/querySinaStockGet.json', data) },
    // 查询用户设置网格信息
    queryOptGridInfo: (data) => { return http.get('api/user/queryOptGridInfo.json', data) },
    // 保存设置网格信息
    saveOptGridInfo: (data) => { return http.post('api/user/saveOptGridInfo.json', data, false) },
    // 查询转债ma数据信息
    queryCbondMa: (data) => { return http.get('api/cBond/queryCbondMa.json', data) },
    // 查询用户设定的自选转债
    queryOptCbs: (data) => { return http.get('api/user/queryOptCbs.json', data) },
    // 保存用户设定的自选转债
    saveOptCbs: (data) => { return http.post('api/user/saveOptCbs.json', data, false) },
    // 查询最近一周的二手房成交量
    queryRecenetWeekDealInfo: (data) => { return http.get('api/house/queryRecenetWeekDealInfo.json', data) },
    // 逐月展示各个年份的二手房成交量
    queryYearDealInfo: (data) => { return http.get('api/house/queryYearDealInfo.json', data) },
    // 查询用户持仓与指数重合度
    queryUserIndexSampleInfo: (data) => { return http.get('api/user/queryUserIndexSampleInfo.json', data) }
}

