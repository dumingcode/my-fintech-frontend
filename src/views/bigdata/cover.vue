/* eslint-disable no-mixed-spaces-and-tabs */
<style lang="less">
@import '../../styles/common.less';
@import '../tables/components/table.less';
</style>

<template>
	<div>
		<Row>
			<Col span="24" class="padding-left-10 height-100">
				<Card>
					<p slot="title" class="card-title">大数投资补仓查询</p>
					<AutoComplete
                        v-model="stock"
                        clearable
                        icon="ios-search"
                        :data="searchResult"
                        @on-search="handleSearch"
                        @on-select="handleSelect"
                        placeholder="输入拼音、代码、股票名称检索"
                        style="width: 20%">
                    </AutoComplete>
					<Button type="success" @click="addToOption">添加到自选</Button>
					<Button type="success" :loading="loading" @click="refreshMyStock">刷新实时价格</Button>
				</Card>

				<Card>
					<p slot="title" class="card-title">自选股补仓表------数量{{tableData.length}}</p>
					<p>
						默认补仓规则：首次建仓价每跌20%补仓。
						<br />若10元建仓，则股价跌到8元、6元、4元、2元分别补仓。
					</p>
					<can-edit-table
						@on-delete="handleDel"
						refs="coverTable"
						:row-class-name="isBelowThreshld"
						@on-cell-change="handleTargetPriceChange"
						:editIncell="true"
						v-model="tableData"
						:columns-list="columnsList"
					></can-edit-table>
				</Card>
			</Col>
		</Row>
	</div>
</template>

<script>
import canEditTable from '../tables/components/canEditTable.vue'
import { isIntNum, isPositiveFloat } from '../../utils/validate'
import table2excel from '@/libs/table2excel.js'
import { getStore } from '../../utils/storageUtil'
import {
    querySinaStockGet,
    queryOptStocks,
    queryOptStockDealDetail,
    saveOptStocks,
    delOptStockDealDetail,
    saveOptStockDealDetail,
    searchStock
} from '../../service/getData'
import { deepCopy } from '../../utils/utils'
export default {
    name: 'cover',
    components: { canEditTable },
    data () {
        return {
            loading: false,
            stock: '',
            tableData: [],
            optStocks: '',
            excelFileName: 'myStock',
            csvFileName: '',
            myStocksTargetPrice: [],
            optStocksDetail: {},
            searchResult: [],
            columnsList: [
                {
                    title: '个股名称',
                    key: 'name',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '个股代码',
                    key: 'code',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '当前时间',
                    key: 'time',
                    width: 160,
                    align: 'center'
                },
                {
                    title: '现价',
                    key: 'price',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '首次买入价',
                    key: 'cost',
                    width: 120,
                    align: 'center',
                    editable: true
                },
                {
                    title: '已补仓次数（默认0）',
                    key: 'coverTime',
                    width: 120,
                    align: 'center',
                    editable: true
                },
                {
                    title: '下一次补仓价',
                    key: 'targetPrice',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '距离补仓点百分比',
                    key: 'position',
                    width: 120,
                    align: 'center',
                    sortable: true,
                    sortMethod: function (a, b, type) {
                        if (a && b) {
                            const aa = parseFloat(a.replace('%'))
                            const bb = parseFloat(b.replace('%'))
                            if (type === 'asc') {
                                return aa - bb
                            } else {
                                return bb - aa
                            }
                        }
                    }
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
        exportExcel () {
            table2excel.transform(
                this.$refs.coverTable,
                'hrefToExportTable',
                this.excelFileName
            )
        },
        async handleDel (val, index, delObj) {
            const delCode = delObj['code']
            if (!delCode) {
                return
            }
            let optStockArr = this.optStocks.split(',')
            optStockArr = optStockArr.filter(val => {
                return val !== delCode
            })
            this.optStocks = optStockArr.join(',')
            // 删除自选股
            const ret = await saveOptStocks({ codes: this.optStocks })
            if (ret.data.code !== 1) {
                this.$Message.error(ret.data.msg)
                return
            }
            this.$store.commit('changeOpStocks', this.optStocks)
            // 删除该股的止盈止损数据信息
            const ret_ = await delOptStockDealDetail({ code: delCode })
            if (ret_.data.code !== 1) {
                this.$Message.error(ret.data.msg)
                return
            }
        },
        isBelowThreshld (row, index) {
            if (row['position']) {
                const pos = parseFloat(row['position'].replace('%'))
                if (pos <= 5) {
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
            if (!isPositiveFloat(coverObj['cost'])) {
                this.$Message.error({
                    content: '买入价格式错误'
                })
                coverObj['cost'] = ''
                return
            }

            if (!isIntNum(coverObj['coverTime'])) {
                this.$Message.error({
                    content: '补仓次数格式错误，只能输入小于5大于等于0的数字'
                })
                coverObj['coverTime'] = ''
                return
            }

            // 补仓次数为
            if (!coverObj['coverTime']) {
                coverObj['coverTime'] = 0
            }

            const coverTimeInt = parseInt(coverObj['coverTime'])
            if (coverTimeInt < 0 || coverTimeInt >= 5) {
                this.$Message.error({
                    content: '补仓次数格式错误，只能输入小于5大于等于0的数字'
                })
                coverObj['coverTime'] = ''
                return
            }

            const coverBs = 1 - 0.2 * (1 + coverTimeInt)

            if (coverObj['cost']) {
                coverObj['targetPrice'] = (
                    parseFloat(coverObj['cost']) * coverBs
                ).toFixed(2)
            }
            coverObj['position'] =
				(
				    (
				        (coverObj['price'] - coverObj['targetPrice']) /
						coverObj['price']
				    ).toFixed(2) * 100
				).toFixed(0) + '%'

            const retData = await saveOptStockDealDetail({
                code: coverObj.code,
                coverTime: parseInt(coverObj['coverTime']),
                cost: Number(parseFloat(coverObj['cost']).toFixed(2))
            })
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
            const retData = await querySinaStockGet({ codes: myStocksStore })
            if (retData.code <= 0) {
                this.$Message.error({ content: '刷新失败' })
                this.loading = false
                return
            }

            const table = deepCopy(retData.data.data)
            // 查询自选股的止盈止损详情
            const optStockDetailRet = await queryOptStockDealDetail()
            if (
                optStockDetailRet &&
				optStockDetailRet.data &&
				optStockDetailRet.data.code === 1
            ) {
                const arr = deepCopy(optStockDetailRet.data.data)
                this.optStocksDetail = {}
                arr.forEach(val => {
                    const code = val['code']
                    this.optStocksDetail[code] = val
                })
            }
            const myStocksJson = this.optStocksDetail
            if (myStocksJson) {
                table.forEach(element => {
                    const coverObj = myStocksJson[element['code']]
                    if (coverObj && coverObj['cost']) {
                        element['cost'] = coverObj['cost']
                    }
                    if (coverObj && coverObj['coverTime']) {
                        element['coverTime'] = parseInt(coverObj['coverTime'])
                    } else {
                        element['coverTime'] = 0
                    }
                    const coverBs = 1 - 0.2 * (1 + element['coverTime'])
                    if (element['cost'] && element['price'] > 0) {
                        element['targetPrice'] = (
                            parseFloat(element['cost']) * coverBs
                        ).toFixed(2)
                        element['position'] =
							(
							    (
							        (element['price'] - element['targetPrice']) /
									element['price']
							    ).toFixed(2) * 100
							).toFixed(0) + '%'
                    }
                })
                this.tableData = table
            }
            this.loading = false
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
            const ret = await saveOptStocks({ codes: this.optStocks })
            if (ret.data.code !== 1) {
                this.$Message.error(ret.data.msg)
            } else {
                this.stock = ''
                this.$Message.success('添加成功')
            }
            this.$store.commit('changeOpStocks', this.optStocks)
            this.refreshMyStock()
        },
        async handleSearch (value) {
            if (!value) {
                return false
            }
            this.searchResult = []
            let cbArray = []
            const ret = await searchStock({ content: value })
            if (ret.data.code !== 1) {
                this.$Message.error(ret.data.msg)
            } else {
                cbArray = ret.data.data
            }
            cbArray.forEach(cb => {
                this.searchResult.push(`${cb.stockname}|${cb.stockcode}`)
            })
        },
        handleSelect (value) {
            if (!value || value.indexOf('|') < 0) {
                return
            }
            const selectedVal = value.split('|')
            const code = selectedVal[1]
            if (isIntNum(code) && code.length === 6) {
                if (this.optStocks) {
                    if (!this.optStocks.includes(code)) {
                        this.optStocks += `,${code}`
                    }
                } else {
                    this.optStocks = code
                }
            }
        }
    },
    async created () {
        const optStockRet = await queryOptStocks()
        if (optStockRet && optStockRet.data && optStockRet.data.code === 1) {
            if (optStockRet.data.data.length > 0) {
                this.optStocks = optStockRet.data.data[0].stock
                this.$store.commit('changeOpStocks', this.optStocks)
            }
        } else {
            this.$Message.error(optStockRet.data.msg)
            return
        }
        this.refreshMyStock()
    }
}
</script>
<style>
.ivu-table .demo-table-info-row td {
	background-color: #2db7f5;
	color: #fff;
}
</style>