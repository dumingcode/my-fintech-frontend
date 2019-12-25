<style lang="less">
@import '../../styles/common.less';
@import '../../views/tables/components/table.less';
</style>

<template>
	<div>
		<Row>
			<Col span="24" class="padding-left-10 height-100">
				<Card>
					<p slot="title" class="card-title">网格行情</p>
					<br />
				</Card>

				<Card>
					<span style="color:#2db7f5">提示：网格需要买入时对应标的蓝色(buy)</span>&nbsp;&nbsp;&nbsp;&nbsp;
					<span style="color:#e08a18">网格需要卖出时对应标的橙黄色(sell)</span>
					<Button type="success" :loading="loading" @click="refreshMyGrid">刷新实时价格</Button>
				</Card>

				<Card>
					<can-edit-table
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
import { isIntNum, isPositiveFloat } from '@/utils/validate'
import canEditTable from '@/views/tables/components/canEditTable.vue'
import { isNull, deepCopy } from '../../utils/utils'
import {
    querySinaStockGet,
    queryOptGridInfo,
    saveOptGridInfo
} from '../../service/getData'

export default {
    name: 'indexGrid',
    components: { canEditTable },
    data () {
        return {
            loading: false,
            stock: '',
            tableData: [],
            gridIndex: '399905,399975,162411,399006,399300',
            columnsList: [
                {
                    title: '名称',
                    key: 'name',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '代码',
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
                    title: '实时行情',
                    key: 'price',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '已投入最低一级网格',
                    key: 'curLevel',
                    width: 160,
                    align: 'center',
                    editable: true
                },
                {
                    title: '网格间距(%)',
                    key: 'gap',
                    width: 120,
                    align: 'center',
                    editable: true
                },
                {
                    title: '下格买入位置',
                    key: 'buyGrid',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '本格卖出位置',
                    key: 'sellGrid',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '进度',
                    key: 'percent',
                    width: 160,
                    align: 'left',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Progress',
                                {
                                    props: {
                                        status: this.calcProgressStatus(
                                            this.tableData[params.index]
                                        ),
                                        percent: this.calcProgressVal(this.tableData[params.index])
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                },
                                `${this.calcProgressVal(this.tableData[params.index]).toFixed(
                                    0
                                )}%`
                            )
                        ])
                    }
                }
            ]
        }
    },
    methods: {
        calcProgressVal (row) {
            if (!(row['price'] && row['gap'] && row['curLevel'])) {
                return 0
            }
            const price = parseFloat(row['price']).toFixed(3)
            const curLevel = parseFloat(row['curLevel']).toFixed(3)
            const sellGrid = parseFloat(row['sellGrid']).toFixed(3)
            const res = parseFloat(
                (Math.abs(price - curLevel) / (sellGrid - curLevel)) * 100
            )
            return res > 100 ? 99.9999 : res
        },
        calcProgressStatus (row) {
            if (!(row['price'] && row['gap'] && row['curLevel'])) {
                return 'normal'
            }
            const price = parseFloat(row['price']).toFixed(3)
            const curLevel = parseFloat(row['curLevel']).toFixed(3)
            if (price < curLevel) {
                return 'active'
            }
            return 'wrong'
        },
        isBelowThreshld (row, index) {
            if (row['price'] && row['curLevel'] && row['gap']) {
                const gap = parseFloat(row['gap']) / 100
                const curLevel = parseFloat(row['curLevel'])
                const price = parseFloat(row['price'])
                // 买入
                if (price <= curLevel * (1 - gap)) {
                    return 'demo-table-info-row-cell'
                } else if (price >= curLevel * (1 + gap)) {
                    // 卖出
                    return 'demo-table-info-row-cell-expensive'
                }
            }
            return ''
        },
        async handleTargetPriceChange (val, index, key) {
            const coverObj = this.tableData[index]
            if (!isPositiveFloat(coverObj['curLevel'])) {
                this.$Message.error({
                    content: '当前网格位置设置错误'
                })
                coverObj['curLevel'] = ''
                return
            }

            if (!isIntNum(coverObj['gap'])) {
                this.$Message.error({
                    content: '网格间距错误，请输入正整数'
                })
                coverObj['gap'] = ''
                return
            }

            const validateGap = parseFloat(coverObj['gap'])
            if (validateGap <= 0 || validateGap >= 100) {
                this.$Message.error({
                    content: '间距范围0-100'
                })
                coverObj['gap'] = ''
                return
            }
            const param = {
                code: coverObj['code']
            }
            if (coverObj['gap']) {
                param['gap'] = Number(parseFloat(coverObj['gap']).toFixed(3))
            }
            if (coverObj['curLevel']) {
                param['low'] = Number(parseFloat(coverObj['curLevel']).toFixed(3))
            }
            const saveRes = await saveOptGridInfo(param)
            if (saveRes && saveRes.data && saveRes.data.code < 0) {
                this.$Message.error({
                    content: '保存失败'
                })
                return
            }

            this.refreshMyGrid()
        },
        async refreshMyGrid () {
            this.loading = true
            const retData = await querySinaStockGet({ codes: `${this.gridIndex}` })
            if (retData.code <= 0) {
                this.$Message.error({ content: '刷新失败' })
                this.loading = false
                return
            }

            const table = deepCopy(retData.data.data)
            const retGridData = await queryOptGridInfo()
            if (!(retGridData && retGridData.data && retGridData.data.code > 0)) {
                this.$Message.error({ content: '获取网格信息失败' })
                return
            }
            const myGridCurLevel = deepCopy(retGridData.data.data)
            const myGridCurLevelJson = {}
            myGridCurLevel.forEach(val => {
                myGridCurLevelJson[`${val.code}`] = {
                    low: Number(parseFloat(val['low']).toFixed(3)),
                    gap: Number(parseFloat(val['gap']).toFixed(3))
                }
            })

            table.forEach(element => {
                const curEle = myGridCurLevelJson[element['code']]
                if (curEle) {
                    if (!isNull(curEle['low'])) {
                        element['curLevel'] = Number(parseFloat(curEle['low']).toFixed(3))
                    }
                    if (!isNull(curEle['gap'])) {
                        element['gap'] = Number(parseFloat(curEle['gap']).toFixed(3))
                    }
                    if (!isNull(curEle['low']) && !isNull(curEle['gap'])) {
                        element['buyGrid'] = (
                            parseFloat(element['curLevel']) *
							(1 - parseFloat(element['gap']) / 100)
                        ).toFixed(3)
                        element['sellGrid'] = (
                            parseFloat(element['curLevel']) *
							(1 + parseFloat(element['gap']) / 100)
                        ).toFixed(3)
                    }
                }
            })
            this.tableData = table.map(item => {
                return {
                    name: item.name,
                    code: item.code,
                    time: item.time,
                    price: item.price,
                    curLevel: item.curLevel,
                    gap: item.gap,
                    buyGrid: item.buyGrid,
                    sellGrid: item.sellGrid
                }
            })
            this.loading = false
        }
    },

    created () {
        this.refreshMyGrid()
    }
}
</script>
<style>
.ivu-table .demo-table-info-row-cell td {
	background-color: #2db7f5;
	color: #fff;
}

.ivu-table .demo-table-info-row-cell-expensive td {
	background-color: #e08a18;
	color: #fff;
}
</style>