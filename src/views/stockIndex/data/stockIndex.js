export const mutualFundColumns = [
    {
        'title': '名称',
        'key': 'pdName',
        'width': 280
    },
    {
        'title': '代码',
        'key': 'pdCode'
    },
    {
        'title': '管理费(%)',
        'key': 'glf',
        'sortable': true
    },
    {
        'title': '托管费(%)',
        'key': 'tgf',
        'sortable': true
    },
    {
        'title': '3年年化',
        'key': 'ret3',
        'sortable': true
    },
    {
        'title': '5年年化',
        'key': 'ret5',
        'sortable': true
    },
    {
        'title': '规模(亿)',
        'key': 'size',
        'sortable': true
    },
    {
        'title': '3年夏普比率',
        'key': 'sharpe3',
        'sortable': true
    },
    {
        'title': '5年夏普比率',
        'key': 'sharpe5',
        'sortable': true
    },
    {
        'title': '低估标准',
        'key': 'cheapJudge'
    }

];
export const mutualFundData = [
    {
        pdName: '富国中证红利指数增强',
        pdCode: '100032',
        glf: 1.2,
        tgf: 0.2,
        ret3: -1.06,
        ret5: 15.59,
        size: 19.94,
        sharpe3: 0.43,
        sharpe5: 0.71,
        cheapJudge: 'PE<10'
    },
    {
        pdName: '大成中证红利指数证券投资基金',
        pdCode: '090010',
        glf: 0.75,
        tgf: 0.15,
        ret3: -3.57,
        ret5: 14.86,
        size: 2.08,
        sharpe3: 0.36,
        sharpe5: 0.66,
        cheapJudge: 'PE<10'
    },
    {
        pdName: '华宝标普中国A股红利机会指数',
        pdCode: '501029',
        glf: 0.75,
        tgf: 0.15,
        ret3: Number.NEGATIVE_INFINITY,
        ret5: 14.69,
        size: 13.69,
        sharpe3: Number.NEGATIVE_INFINITY,
        sharpe5: Number.NEGATIVE_INFINITY,
        cheapJudge: 'PE<15'
    },
    {
        pdName: '景顺长城中证500行业中性低波动指数型证券投资基金',
        pdCode: '003318',
        glf: 0.5,
        tgf: 0.1,
        ret3: Number.NEGATIVE_INFINITY,
        ret5: Number.NEGATIVE_INFINITY,
        size: 3.78,
        sharpe3: Number.NEGATIVE_INFINITY,
        sharpe5: Number.NEGATIVE_INFINITY,
        cheapJudge: 'PE<27'
    },
    {
        pdName: '南方中证500指数ETF联接 ',
        pdCode: '160119',
        glf: 0.6,
        tgf: 0.12,
        ret3: -16.39,
        ret5: 8.88,
        size: 58.94,
        sharpe3: Number.NEGATIVE_INFINITY,
        sharpe5: '0.52',
        cheapJudge: 'PE<25'
    },
    {
        pdName: '建信中证500指数增强A ',
        pdCode: '000478',
        glf: 1,
        tgf: 0.2,
        ret3: -8.06,
        ret5: Number.NEGATIVE_INFINITY,
        size: 32,
        sharpe3: '0.31',
        sharpe5: Number.NEGATIVE_INFINITY,
        cheapJudge: 'PE<25'
    },
    {
        pdName: '易方达证券公司指数分级证券投资基金  ',
        pdCode: '502010',
        glf: 1,
        tgf: 0.2,
        ret3: Number.NEGATIVE_INFINITY,
        ret5: Number.NEGATIVE_INFINITY,
        size: 4.23,
        sharpe3: '0.31',
        sharpe5: Number.NEGATIVE_INFINITY,
        cheapJudge: ''
    },
    {
        pdName: '国联安中证医药100指数  ',
        pdCode: '000059',
        glf: 0.8,
        tgf: 0.2,
        ret3: -10.56,
        ret5: Number.NEGATIVE_INFINITY,
        size: 16.87,
        sharpe3: '0.11',
        sharpe5: Number.NEGATIVE_INFINITY,
        cheapJudge: ''
    },
    {
        pdName: '易方达恒生中国企业ETF联接A  ',
        pdCode: '110031',
        glf: 0.6,
        tgf: 0.2,
        ret3: -1.76,
        ret5: 4.17,
        size: 18.22,
        sharpe3: '0.05',
        sharpe5: '0.15',
        cheapJudge: 'PE<9.1'
    },
    {
        pdName: '广发中证养老产业指数A  ',
        pdCode: '000968',
        glf: 0.5,
        tgf: 0.1,
        ret3: -10.93,
        ret5: Number.NEGATIVE_INFINITY,
        size: 4.54,
        sharpe3: '0.04',
        sharpe5: Number.NEGATIVE_INFINITY,
        cheapJudge: ''
    },
    {
        pdName: '易方达沪深300量化增强  ',
        pdCode: '110030',
        glf: 0.8,
        tgf: 0.15,
        ret3: -2.14,
        ret5: Number.NEGATIVE_INFINITY,
        size: 13.55,
        sharpe3: '0.32',
        sharpe5: Number.NEGATIVE_INFINITY,
        cheapJudge: ''
    },
    {
        pdName: '易方达沪深300ETF联接  ',
        pdCode: '110020',
        glf: 0.2,
        tgf: 0.1,
        ret3: -6.78,
        ret5: 9.34,
        size: 42.44,
        sharpe3: '0.11',
        sharpe5: '0.48',
        cheapJudge: ''
    },
    {
        pdName: '景顺长城沪深300指数增强  ',
        pdCode: '000311',
        glf: 1,
        tgf: 0.2,
        ret3: -0.18,
        ret5: Number.NEGATIVE_INFINITY,
        size: 84.07,
        sharpe3: '0.43',
        sharpe5: Number.NEGATIVE_INFINITY,
        cheapJudge: ''
    },
    {
        pdName: '嘉实沪深300ETF联接  ',
        pdCode: '160706',
        glf: 0.5,
        tgf: 0.1,
        ret3: -7.32,
        ret5: 9.26,
        size: 164.01,
        sharpe3: '0.09',
        sharpe5: '0.48',
        cheapJudge: ''
    },
    {
        pdName: '华夏沪港通上证50AH优选指数  ',
        pdCode: '501050',
        glf: 0.5,
        tgf: 0.1,
        ret3: Number.NEGATIVE_INFINITY,
        ret5: Number.NEGATIVE_INFINITY,
        size: 6.14,
        sharpe3: Number.NEGATIVE_INFINITY,
        sharpe5: Number.NEGATIVE_INFINITY,
        cheapJudge: 'PE<10'
    },
    {
        pdName: '易方达上证50指数A',
        pdCode: '110003',
        glf: 1.2,
        tgf: 0.2,
        ret3: 3.16,
        ret5: 14.85,
        size: 101.4,
        sharpe3: '0.45',
        sharpe5: '0.62',
        cheapJudge: 'PE<10'
    },
    {
        pdName: '建信深证基本面60ETF联接',
        pdCode: '530015',
        glf: 0.5,
        tgf: 0.1,
        ret3: 3.04,
        ret5: 15.6,
        size: 3.3,
        sharpe3: '0.51',
        sharpe5: '0.71',
        cheapJudge: '预测盈利增速法 18-23以下低估'
    },
    {
        pdName: '华夏上证50ETF联接A',
        pdCode: '001051',
        glf: 0.5,
        tgf: 0.1,
        ret3: -5.38,
        ret5: Number.NEGATIVE_INFINITY,
        size: 7.5,
        sharpe3: '0.51',
        sharpe5: '0.71',
        cheapJudge: 'PE<10'
    },
    {
        pdName: '嘉实中证锐联基本面50指数(LOF)',
        pdCode: '160716',
        glf: 1,
        tgf: 0.18,
        ret3: 0.89,
        ret5: 15.89,
        size: 18,
        sharpe3: 0.41,
        sharpe5: 0.63,
        cheapJudge: 'PE<10'
    },
    {
        pdName: '建信央视财经50指数分级',
        pdCode: '165312',
        glf: 0.1,
        tgf: 0.22,
        ret3: 4.41,
        ret5: 15.01,
        size: 13.41,
        sharpe3: '0.64',
        sharpe5: '0.75',
        cheapJudge: 'PE<10'
    },
    {
        pdName: '工银深证红利ETF联接',
        pdCode: '481012',
        glf: 0.5,
        tgf: 0.1,
        ret3: 2.82,
        ret5: 15.72,
        size: 7.09,
        sharpe3: '0.44',
        sharpe5: '0.7',
        cheapJudge: ''
    }
]
