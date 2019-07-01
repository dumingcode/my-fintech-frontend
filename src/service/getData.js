const http = require('../utils/http');

module.exports = {
    // 查询中信一级行业
    queryCitiFstIndustryInfo: (data) => { return http.get('api/bigdata/queryCitiFstIndustryInfo.json', data) },
    // 查询中信二级行业
    queryCitiSndIndustryInfo: (data) => { return http.get('api/bigdata/queryCitiSndIndustryInfo.json', data) },
    // 批量查询个股所属一二级行业
    queryStockIndInfo: (data) => { return http.get(`api/bigdata/queryStockIndInfo.json?codes=${data}`, data) },
    // 查询个股相对沪深300的alpha和beta
    queryStockAlphaBeta: (data) => { return http.get(`api/stockQuant/queryStockAlphaBeta.json?codes=${data}`, data) },
    // 查询用户信息
    queryUserInfo: (data) => { return http.get('api/user/queryUserInfo.json', data) },
    // 测试登陆
    loginTest: (data) => { return http.get('api/auth/loginTest.json', data) },
    // 退出登陆
    logout: (data) => { return http.get('api/auth/logout.json', data) }
}

