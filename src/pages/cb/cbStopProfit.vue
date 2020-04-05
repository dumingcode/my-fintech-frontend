<style lang="less">
@import '../../styles/common.less';
@import '../../views/tables/components/table.less';
</style>

<template>
  <div>

    <Row>
      <Col span="24" class="padding-left-10 height-100">
        <Card>
          <p slot="title" class="card-title">转债止盈查询</p>
          <AutoComplete
            v-model="stock"
            clearable
            icon="ios-search"
            :data="searchResult"
            @on-search="handleSearch"
            @on-select="handleSelect"
            placeholder="输入拼音、代码、转债、正股名称检索"
            style="width: 20%">
          </AutoComplete>
          <Button type="success" @click="addToOption">添加到自选</Button>
        </Card>
        <Card>
             <p slot="title" class="card-title">最近15日上市转债查询  <i-switch :value="showCbondBasic" @on-change="showCbondBasic=!showCbondBasic">关闭</i-switch></p> 
            
            <can-edit-table  v-show="showCbondBasic" style="width:480px"
                :editIncell="true"
                @on-delete="handleOpt"
                :inputType="inputType"
                v-model="cbTable"
                :columns-list="cbColumns"
          ></can-edit-table>
        </Card>
        <Card>
          <span style="font-weight:bold">止盈趋势线选择</span>
          <Select v-model="firstProfit" style="width:200px" @on-change="changeFirstProfit">
            <Option value="5" key="5">ma5</Option>
            <Option value="10" key="10">ma10</Option>
            <Option value="20" key="20">ma20</Option>
          </Select>
         <span style="font-weight:bold">转债数量：{{tableData.length}}</span>
         <Button type="success" :loading="loading" @click="refreshMyCb">刷新实时价格</Button>
        </Card>
        <Card>
             
          <can-edit-table
            @on-delete="handleDel"
            refs="profitTable"
            :row-class-name="isBelowThreshld"
            @on-cell-change="handleTargetPriceChange"
            :editIncell="true"
            :inputType="inputType"
            v-model="tableData"
            :columns-list="columnsList"
          ></can-edit-table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import canEditTable from '@/views/tables/components/canEditTable.vue'
import { isIntNum } from '@/utils/validate'
import { deepCopy } from '../../utils/utils'
import {
    querySinaStockGet,
    queryCbondMa,
    queryOptCbs,
    saveOptCbs,
    queryOptCbDealDetail,
    delOptCbDealDetail,
    saveOptCbDealDetail,
    queryRecentCbBasicInfo,
    searchCb
} from '../../service/getData'
export default {
    name: 'cbStopProfit',
    components: { canEditTable },
    data () {
        return {
            loading: false,
            inputType: 'textarea',
            stock: '',
            optCbs: '',
            tableData: [],
            cbTable: [],
            excelFileName: 'myStock',
            csvFileName: '',
            myStocksTargetPrice: [],
            firstProfit: '20',
            optCbsDetail: {},
            showCbondBasic: true,
            searchResult: [],
            cbColumns: [
                {
                    title: '个股代码',
                    key: 'BONDCODE',
                    fixed: 'left',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '个股名称',
                    key: 'SNAME',
                    fixed: 'left',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '上市日期',
                    key: 'LISTDATE',
                    fixed: 'left',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 120,
                    key: 'handle',
                    handle: ['opt']
                }
            ],
            columnsList: [
                {
                    type: 'expand',
                    width: 50,
                    fixed: 'left',
                    render: (h, params) => {
                        return h('span', '备注：' + params.row.memo)
                    }
                },
                {
                    title: '个股名称',
                    key: 'name',
                    fixed: 'left',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '个股代码',
                    key: 'code',
                    fixed: 'left',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '当前时间',
                    key: 'time',
                    fixed: 'left',
                    width: 160,
                    align: 'center'
                },
                {
                    title: '现价',
                    key: 'price',
                    fixed: 'left',
                    width: 120,
                    align: 'center',
                    sortable: true,
                    sortMethod: function (a, b, type) {
                        if (a && b) {
                            const aa = parseFloat(a)
                            const bb = parseFloat(b)
                            if (type === 'asc') {
                                return aa - bb
                            } else {
                                return bb - aa
                            }
                        }
                    }
                },
                {
                    title: 'ma5',
                    key: 'ma5',
                    width: 80,
                    align: 'center'
                },
                {
                    title: 'ma10',
                    key: 'ma10',
                    width: 80,
                    align: 'center'
                },
                {
                    title: 'ma20',
                    key: 'ma20',
                    width: 80,
                    align: 'center'
                },
                {
                    title: 'atr',
                    key: 'atr',
                    width: 80,
                    align: 'center'
                },
                {
                    title: 'ma更新时间',
                    key: 'uptTime',
                    width: 160,
                    align: 'center'
                },
                {
                    title: '备注',
                    key: 'memo',
                    width: 400,
                    align: 'center',
                    editable: true
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 120,
                    key: 'handle',
                    handle: ['delete']
                }
            ]
        }
    },
    methods: {
        async handleDel (val, index, delObj) {
            const delCode = delObj['code']
            if (!delCode) {
                return
            }
            let optStockArr = this.optCbs.split(',')
            optStockArr = optStockArr.filter(val => {
                return val !== delCode
            })
            this.optCbs = optStockArr.join(',')
            const ret = await saveOptCbs({ codes: this.optCbs })
            if (ret.data.code !== 1) {
                this.$Message.error(ret.data.msg)
                return
            }

            // 删除该股的止盈止损数据信息
            const ret_ = await delOptCbDealDetail({ 'code': delCode })
            if (ret_.data.code !== 1) {
                this.$Message.error(ret.data.msg)
                return
            }
        },
        async handleOpt (val, index, delObj) {
            const optCode = delObj['BONDCODE']
            if (!optCode) {
                return
            }
            if (isIntNum(optCode) && optCode.length === 6) {
                if (this.optCbs) {
                    if (!this.optCbs.includes(optCode)) {
                        this.optCbs += `,${optCode}`
                    }
                } else {
                    this.optCbs = optCode
                }
            }
            const ret = await saveOptCbs({ codes: this.optCbs })
            if (ret.data.code !== 1) {
                this.$Message.error(ret.data.msg)
            }
            await this.refreshMyCb()
        },
        changeFirstProfit () {
            this.refreshMyCb()
        },
        // 当前价格大于130 且 低于ma20
        isBelowThreshld (row, index) {
            if (row['price']) {
                const pos = parseFloat(row['price'])
                let benchmark
                if (this.firstProfit === '5') {
                    benchmark = parseFloat(row['ma5'])
                } else if (this.firstProfit === '10') {
                    benchmark = parseFloat(row['ma10'])
                } else if (this.firstProfit === '20') {
                    benchmark = parseFloat(row['ma20'])
                }

                if (pos >= 130 && pos <= benchmark) {
                    return 'demo-table-info-row'
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        async refreshMyCb () {
            this.loading = true
            const retData = await this.queryDealData(this.optCbs)
            this.tableData = retData
            // 查询自选转债的备注情况
            const optStockDetailRet = await queryOptCbDealDetail()
            if (optStockDetailRet && optStockDetailRet.data && optStockDetailRet.data.code === 1) {
                const arr = deepCopy(optStockDetailRet.data.data)
                this.optCbsDetail = {}
                arr.forEach((val) => {
                    const code = val['code']
                    this.optCbsDetail[code] = val
                })
            }
            const copyArr = []
            this.tableData.forEach((ele) => {
                const code = ele.code
                const detail = this.optCbsDetail[code]
                ele['memo'] = detail ? detail['memo'] : ''
                copyArr.push(ele)
            })
            this.tableData = copyArr
            this.loading = false
        },
        queryDealData (myStocksStore) {
            if (!myStocksStore) {
                return []
            }
            return Promise.all([
                querySinaStockGet({ codes: `${myStocksStore}` }),
                queryCbondMa({ codes: `${myStocksStore}` })
            ]).then(values => {
                let pObj = values[0]
                let lObj = values[1]
                pObj = pObj.data // 新浪实时股价
                lObj = lObj.data // ma20

                const lMap = {}
                let pTable = []
                if (lObj && lObj.code === 1) {
                    const lTable = lObj.data
                    for (let i = 0; i < lTable.length; i++) {
                        const obj = JSON.parse(lTable[i])
                        lMap[obj['code'] + 'ma20'] = obj['ma20']
                        lMap[obj['code'] + 'ma10'] = obj['ma10']
                        lMap[obj['code'] + 'ma5'] = obj['ma5']
                        lMap[obj['code'] + 'atr'] = obj['atr']
                        lMap[obj['code'] + 'ma20GenDate'] = obj['ma20GenDate']
                        lMap[obj['code']] = obj['code']
                    }
                }
                if (pObj && pObj.code > 0) {
                    pTable = pObj.data
                    for (let i = 0; i < pTable.length; i++) {
                        const element = pTable[i]
                        const code = element['code']
                        if (lMap[code]) {
                            element['ma20'] = lMap[code + 'ma20']
                            element['ma10'] = lMap[code + 'ma10']
                            element['ma5'] = lMap[code + 'ma5']
                            element['atr'] = lMap[code + 'atr']
                            element['uptTime'] = lMap[code + 'ma20GenDate']
                        }
                    }
                }
                return pTable
            })
        },
        async addToOption () {
            if (!this.stock) {
                this.$Message.warning({
                    content: '请输入可转债代码，支持拼音、代码、汉字检索'
                })
                return
            }
            this.stock = this.stock.replace(/，/g, ',')
            const stockArr = this.stock.split(',')
            stockArr.forEach(code => {
                if (isIntNum(code) && code.length === 6) {
                    if (this.optCbs) {
                        if (!this.optCbs.includes(code)) {
                            this.optCbs += `,${code}`
                        }
                    } else {
                        this.optCbs = code
                    }
                }
            })
            const ret = await saveOptCbs({ codes: this.optCbs })
            if (ret.data.code !== 1) {
                this.$Message.error(ret.data.msg)
            } else {
                this.stock = ''
                this.$Message.success('添加成功')
            }
            await this.refreshMyCb()
        },
        async handleTargetPriceChange (val, index, key) {
            const coverObj = this.tableData[index]
            const retData = await saveOptCbDealDetail({ 'code': coverObj.code, 'memo': coverObj['memo'] })
            if (retData.data.code !== 1) {
                this.$Message.error(retData.data.msg)
            }
        },
        async queryCbInfo () {
            const data = await queryRecentCbBasicInfo({ 'diff': 15 })
            console.log(data)
            if (data.data.code === 1) {
                this.cbTable = JSON.parse(data.data.data)
                this.cbTable = this.cbTable.filter(cb => !this.optCbs.includes(cb.BONDCODE))
            }
        },
        async handleSearch (value) {
            if (!value) {
                return false
            }
            this.searchResult = []
            let cbArray = []
            const ret = await searchCb({ content: value })
            if (ret.data.code !== 1) {
                this.$Message.error(ret.data.msg)
            } else {
                cbArray = ret.data.data
            }
            cbArray.forEach(cb => {
                this.searchResult.push(`${cb.bondname}|${cb.bondcode}`)
            })
        },
        handleSelect (value) {
            if (!value || value.indexOf('|') < 0) {
                return
            }
            const selectedVal = value.split('|')
            const code = selectedVal[1]
            if (isIntNum(code) && code.length === 6) {
                if (this.optCbs) {
                    if (!this.optCbs.includes(code)) {
                        this.optCbs += `,${code}`
                    }
                } else {
                    this.optCbs = code
                }
            }
        }
    },
    async created () {
        this.firstProfit = '20'
        const cbRet = await queryOptCbs()
        if (!(cbRet && cbRet.data && cbRet.data.code > 0 && cbRet.data.data)) {
            return
        }
        this.optCbs = cbRet.data.data[0]['cb']
        this.refreshMyCb()
        this.queryCbInfo()
    }
}
</script>
<style>
.ivu-table .demo-table-info-row td {
  background-color: #2db7f5;
  color: #fff;
}
</style>