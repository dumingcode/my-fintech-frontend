<style lang="less">
@import '../../styles/common.less';
@import '../tables/components/table.less';
</style>

<template>
	<div>
		<Row>
			<Col span="24" class="padding-left-10 height-100">
				<Card>
					<p slot="title" class="card-title">大数投资止盈查询</p>
				<!-- </Card>
				<Card> -->
					<Input
						v-model="stock"
						type="textarea"
						:rows="4"
						placeholder="输入实例(逗号间隔):600010,002013,002011"
						clearable
						style="width: 40%"
					></Input>
					<Button type="success" @click="addToOption">添加到自选</Button>
					<Button type="success" :loading="loading" @click="refreshMyStock">刷新实时价格</Button>
				</Card>

				<Card>
					<p>
						自选股止盈表------数量{{tableData.length}}--------覆盖国证二级行业
						<span style="color:red">{{citics1VNum}}</span>/30-------覆盖国证三级行业
						<span style="color:red">{{citics2VNum}}</span>/88-----距离止盈点平均值
						<span style="color:red">{{avgPos}}</span>-----当前页面止盈次数
						<span style="color:red">{{sumStopProfitTime}}</span>
                        -----历史止盈总次数
						<InputNumber  @on-change="changeTotalStopProfitTime" :min="0" v-model="totalStopProfitTime"></InputNumber>
					</p>
				</Card>
				<Card>
					<span style="font-weight:bold">首次止盈点选择</span>
					<Select v-model="firstProfit" style="width:200px" @on-change="changeFirstProfit">
						<Option value="50" key="50">一年最低点上涨50%</Option>
						<Option value="100" key="100">一年最低点上涨100%</Option>
					</Select>

					<span>默认补仓规则：一年内最低点涨幅50%、100%、200%、300%分别止盈。</span>
				</Card>
				<Card>
					<can-edit-table
						@on-delete="handleDel"
						refs="profitTable"
						:row-class-name="isBelowThreshld"
						@on-cell-change="handleTargetPriceChange"
						:editIncell="true"
						v-model="tableData"
                        :inputType="inputType"
						:columns-list="columnsList"
					></can-edit-table>
				</Card>
			</Col>
		</Row>
	</div>
</template>

<script>
import axios from 'axios';
import canEditTable from '../tables/components/canEditTable.vue'
import { getStore } from '../../utils/storageUtil'
import { isIntNum } from '../../utils/validate'
import { deepCopy } from '../../utils/utils'
import { queryOptStocks, queryOptStockDealDetail, saveOptStocks, saveOptStockDealDetail, delOptStockDealDetail, queryTotalStopProfitTime, saveTotalStopProfitTime } from '../../service/getData'
export default {
    name: 'stopProfit',
    components: { canEditTable },
    data () {
        return {
            citics1VNum: 0,
            citics2VNum: 0,
            inputType: 'textarea',
            firstProfit: '100',
            loading: false,
            stock: '',
            optStocks: '',
            optStocksDetail: {},
            tableData: [],
            excelFileName: 'myStock',
            csvFileName: '',
            myStocksTargetPrice: [],
            avgPos: 0,
            sumStopProfitTime: 0,
            totalStopProfitTime: 0,
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
                    align: 'center'
                },
                {
                    title: '52周最低价',
                    key: 'yearLow',
                    fixed: 'left',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '止盈价',
                    key: 'targetPrice',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '已止盈次数（默认0）',
                    key: 'profitTime',
                    width: 140,
                    align: 'center',
                    sortable: true,
                    editable: true
                },
                {
                    title: '距离止盈点百分比',
                    key: 'position',
                    width: 120,
                    align: 'center',
                    sortable: true,
                    sortType: 'asc',
                    sortMethod: function (a, b, type) {
                        if (a && b) {
                            const aa = parseFloat(a.replace('%'));
                            const bb = parseFloat(b.replace('%'));
                            if (type === 'asc') {
                                return aa - bb;
                            } else {
                                return bb - aa;
                            }
                        }
                    }
                },
                {
                    title: '距首次翻倍止盈',
                    key: 'doublePos',
                    width: 120,
                    align: 'center',
                    sortable: true,
                    sortMethod: function (a, b, type) {
                        if (a && b) {
                            const aa = parseFloat(a.replace('%'));
                            const bb = parseFloat(b.replace('%'));
                            if (type === 'asc') {
                                return aa - bb
                            } else {
                                return bb - aa
                            }
                        }
                    }
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
        };
    },
    methods: {
        // 将本地自选股代码同步到云端
        async syncLocalStorageToCloud () {
            const myLocalStocks = getStore('myStocks')
            if (!this.optStocks && myLocalStocks) {
                const stockArr = myLocalStocks.split(',')
                stockArr.forEach(code => {
                    if (isIntNum(code) && code.length === 6) {
                        if (this.optStocks) {
                            if (!this.optStocks.includes(code)) {
                                this.optStocks += `,${code}`
                            }
                        } else {
                            this.optStocks = code
                        }
                    }
                })
                await saveOptStocks({ 'codes': this.optStocks })
                this.$store.commit('changeOpStocks', this.optStocks)
                // 从storageClient中找出止盈次数并同步到云端
                const myLocalStocksProfitTime = getStore('myStocksProfitTime')
                let myLocalStocksProfitTimeJson = ''
                if (myLocalStocksProfitTime) {
                    myLocalStocksProfitTimeJson = JSON.parse(myLocalStocksProfitTime)
                }
                const stockArr_ = this.optStocks.split(',')
                // eslint-disable-next-line prefer-const
                let syncProcArr = []
                stockArr_.forEach((code) => {
                    if (myLocalStocksProfitTimeJson[code]) {
                        syncProcArr.push(saveOptStockDealDetail({ 'code': code, 'profitTime': myLocalStocksProfitTimeJson[code] }))
                    }
                })
                Promise.all(syncProcArr).then(function (values) {
                    console.log(values)
                }).catch((reason) => {
                    console.log(reason)
                })
            }
        },
        // 计算首次止盈价
        calcTargetPrice (yearLow, profitTime) {
            // 首次止盈50%
            if (this.firstProfit === '50') {
                if (profitTime === 0) {
                    return (yearLow * 1.5).toFixed(2)
                } else {
                    return (yearLow * (profitTime + 1)).toFixed(2)
                }
            }
            if (this.firstProfit === '100') {
                return (yearLow * (profitTime + 2)).toFixed(2)
            }
        },

        async handleDel (val, index, delObj) {
            const delCode = delObj['code']
            if (!delCode) {
                return
            }
            let optStockArr = this.optStocks.split(',')
            optStockArr = optStockArr.filter((val) => {
                return val !== delCode
            })
            this.optStocks = optStockArr.join(',')
            // 删除自选股
            const ret = await saveOptStocks({ 'codes': this.optStocks })
            if (ret.data.code !== 1) {
                this.$Message.error(ret.data.msg)
                return
            }
            this.$store.commit('changeOpStocks', this.optStocks)
            // 删除该股的止盈止损数据信息
            const ret_ = await delOptStockDealDetail({ 'code': delCode })
            if (ret_.data.code !== 1) {
                this.$Message.error(ret.data.msg)
                return
            }
        },
        isBelowThreshld (row, index) {
            if (row['position']) {
                const pos = parseFloat(row['position'].replace('%'))
                if (pos <= 10) {
                    return 'demo-table-info-row'
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        async handleTargetPriceChange (val, index, key) {
            const coverObj = this.tableData[index]

            if (!isIntNum(coverObj['profitTime'])) {
                this.$Message.error({
                    content: '止盈次数格式错误'
                });
                coverObj['profitTime'] = ''
                return
            }

            // 默认止盈次数为
            if (!coverObj['profitTime']) {
                coverObj['profitTime'] = 0
            }

            const profitTimeInt = parseInt(coverObj['profitTime'])
            if (profitTimeInt < 0) {
                this.$Message.error({
                    content: '止盈次数格式错误'
                });
                coverObj['profitTime'] = ''
                return
            }

            const stopProfit = this.calcTargetPrice(coverObj['yearLow'], profitTimeInt)
            coverObj['targetPrice'] = stopProfit
            if (coverObj['price'] > 0) {
                coverObj['position'] =
          (
              (
                  (coverObj['targetPrice'] - coverObj['price']) /
              coverObj['price']
              ).toFixed(2) * 100
          ).toFixed(0) + '%'
                coverObj['doublePos'] =
          (
              (
                  (coverObj['yearLow'] * 2 - coverObj['price']) /
              coverObj['price']
              ).toFixed(2) * 100
          ).toFixed(0) + '%'
            }
            const retData = await saveOptStockDealDetail({ 'code': coverObj.code, 'profitTime': parseInt(coverObj['profitTime']), 'memo': coverObj['memo'] })
            if (retData.data.code !== 1) {
                this.$Message.error(retData.data.msg)
            }
        },
        async refreshMyStock () {
            this.loading = true
            this.optStocks = this.$store.state.user.opStocks
            const myStocksStore = this.optStocks
            if (!myStocksStore) {
                this.loading = false
                return
            }
            // 查询自选股的止盈止损详情
            const optStockDetailRet = await queryOptStockDealDetail()
            if (optStockDetailRet && optStockDetailRet.data && optStockDetailRet.data.code === 1) {
                const arr = deepCopy(optStockDetailRet.data.data)
                this.optStocksDetail = {}
                arr.forEach((val) => {
                    const code = val['code']
                    this.optStocksDetail[code] = val
                })
            }

            const retData = await this.getSinaData(myStocksStore)
            this.tableData = retData
            const myStocksProfitTimeJson = this.optStocksDetail
            this.avgPos = 0
            this.sumStopProfitTime = 0
            this.tableData.forEach(element => {
                const deal = myStocksProfitTimeJson[element['code']]
                if (myStocksProfitTimeJson && deal && deal['profitTime']) {
                    element['profitTime'] = parseInt(
                        deal['profitTime']
                    )
                } else {
                    element['profitTime'] = 0
                }

                if (myStocksProfitTimeJson && deal && deal['memo']) {
                    element['memo'] = deal['memo']
                } else {
                    element['memo'] = ''
                }
                const stopProfit = this.calcTargetPrice(
                    element['yearLow'],
                    element['profitTime']
                )
                element['targetPrice'] = stopProfit
                if (element['price'] > 0) {
                    element['position'] =
            (
                (
                    (element['targetPrice'] - element['price']) /
                element['price']
                ).toFixed(2) * 100
            ).toFixed(0) + '%'
                    element['doublePos'] =
          (
              (
                  (element['yearLow'] * 2 - element['price']) /
              element['price']
              ).toFixed(2) * 100
          ).toFixed(0) + '%'

                    this.avgPos += parseInt(element['position'].replace('%', ''))
                    this.sumStopProfitTime += parseInt(element['profitTime'])
                }
            })

            if (this.tableData.length > 0) {
                this.avgPos = (this.avgPos / this.tableData.length).toFixed(2)
            } else {
                this.avgPos = 0
            }
            if (this.totalStopProfitTime === 0) {
                this.totalStopProfitTime = this.sumStopProfitTime
            }
            this.loading = false
        },
        getSinaData (myStocksStore) {
            return Promise.all([
                axios.get(`/api/bigdata/querySinaStockGet.json?codes=${myStocksStore}`),
                axios.get(
                    `/api/bigdata/queryStockYearLowPrice.json?codes=${myStocksStore}`
                )
            ]).then(values => {
                let pObj = values[0]
                let lObj = values[1]
                const c1vSet = new Set()
                const c2vSet = new Set()

                pObj = pObj.data
                lObj = lObj.data

                const lMap = {}
                let pTable = []
                if (lObj && lObj.code === 1) {
                    const lTable = lObj.data
                    for (let i = 0; i < lTable.length; i++) {
                        const obj = JSON.parse(lTable[i])
                        lMap[obj['code']] = obj['low']
                        c1vSet.add(obj['gz2'])
                        c2vSet.add(obj['gz3'])
                    }
                }
                this.citics1VNum = c1vSet.size
                this.citics2VNum = c2vSet.size

                if (pObj && pObj.code > 0) {
                    pTable = pObj.data
                    for (let i = 0; i < pTable.length; i++) {
                        const element = pTable[i]
                        const code = element['code']
                        if (lMap[code]) {
                            element['yearLow'] = lMap[code]
                        }
                    }
                }
                return pTable
            })
        },
        changeFirstProfit () {
            this.refreshMyStock()
        },
        async changeTotalStopProfitTime () {
            const ret = await saveTotalStopProfitTime({ 'totalTime': this.totalStopProfitTime })
            if (ret.data.code !== 1) {
                this.$Message.error(ret.data.msg)
            } else {
                this.$Message.success('更新成功')
            }
        },
        async addToOption () {
            if (!this.stock) {
                this.$Message.warning({
                    content: '请输入股票代码，多个代码直接逗号间隔'
                })
                return
            }
            this.stock = this.stock.replace(/，/g, ',')
            const stockArr = this.stock.split(',')
            stockArr.forEach(code => {
                if (isIntNum(code) && code.length === 6) {
                    if (this.optStocks) {
                        if (!this.optStocks.includes(code)) {
                            this.optStocks += `,${code}`
                        }
                    } else {
                        this.optStocks = code
                    }
                }
            })
            const ret = await saveOptStocks({ 'codes': this.optStocks })
            if (ret.data.code !== 1) {
                this.$Message.error(ret.data.msg)
            }
            this.$store.commit('changeOpStocks', this.optStocks)
            this.refreshMyStock()
        }
    },
    // 页面初始加载时 将本地localstorage写的代码同步到云端
    async created () {
        this.$set(this, 'firstProfit', '100')
        this.$set(this, 'citics1VNum', 0)
        this.$set(this, 'citics2VNum', 0)
        // 查询本人的自选股
        const optStockRet = await queryOptStocks()
        if (optStockRet && optStockRet.data && optStockRet.data.code === 1) {
            if (optStockRet.data.data.length > 0) {
                this.optStocks = (optStockRet.data.data)[0].stock
                this.$store.commit('changeOpStocks', this.optStocks)
            }
        } else {
            this.$Message.error(optStockRet.data.msg)
        }
        const totalProfitTimeData = await queryTotalStopProfitTime()
        if (totalProfitTimeData && totalProfitTimeData.data && totalProfitTimeData.data.code === 1) {
            if (totalProfitTimeData.data.data.length > 0) {
                this.totalStopProfitTime = (totalProfitTimeData.data.data)[0].totalTime || 0
            }
        } else {
            this.$Message.error(totalProfitTimeData.data.msg)
        }
        this.refreshMyStock()
    }
};
</script>
<style>
.ivu-table .demo-table-info-row td {
	background-color: #2db7f5;
	color: #fff;
}
</style>