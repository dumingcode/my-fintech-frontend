<style lang="less">
@import '../../styles/common.less';
@import '../tables/components/table.less';
</style>

<template>
	<div>
		<Row>
			<Col span="22" class="padding-left-10 height-100">
				<Card>
					<p slot="title" class="card-title">大数投资持仓个股alpha-beta查询</p>
                    R方表示大盘涨幅对个股涨幅的贡献比 数据更新时间：<span style="color:red">{{refreshDate}}</span>
				</Card>
				<Card>
					<Table stripe :data="fstIndData" :columns="fstColumnsList"></Table>
				</Card>
			</Col>
		</Row>
	</div>
</template>

<script>
import { queryStockAlphaBeta, queryOptStocks } from '../../service/getData'
export default {
    name: 'alpha_beta',
    data () {
        return {
            loading: false,
            fstIndData: [],
            stockInfo: [],
            optStocks: '',
            refreshDate: '',
            fstColumnsList: [
                {
                    title: '序号',
                    key: 'no',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '代码',
                    key: 'code',
                    width: 160,
                    align: 'center'
                },
                {
                    title: '个股名称',
                    key: 'name',
                    width: 100,
                    align: 'left'
                },
                {
                    title: '近2年alpha',
                    key: 'alpha2',
                    width: 100,
                    align: 'left',
                    sortable: true,
                    sortMethod: this.compare
                },
                {
                    title: '近2年beta',
                    key: 'beta2',
                    width: 100,
                    align: 'left',
                    sortable: true,
                    sortMethod: this.compare
                },
                {
                    title: '近2年R方',
                    key: 'r2',
                    width: 100,
                    align: 'left',
                    sortable: true,
                    sortMethod: this.compare
                },
                {
                    title: '近1年alpha',
                    key: 'alpha1',
                    width: 100,
                    align: 'left',
                    sortable: true,
                    sortMethod: this.compare
                },
                {
                    title: '近1年beta',
                    key: 'beta1',
                    width: 100,
                    align: 'left',
                    sortable: true,
                    sortMethod: this.compare
                },
                {
                    title: '近1年R方',
                    key: 'r1',
                    width: 100,
                    align: 'left',
                    sortable: true,
                    sortMethod: this.compare
                }
            ]
        }
    },
    methods: {
        async queryAlphaBetaData () {
            this.optStocks = this.$store.state.user.opStocks
            if (!this.optStocks) {
                return
            }
            const myStocksStore = this.optStocks
            const vals = await queryStockAlphaBeta({ codes: myStocksStore })
            this.stockInfo = vals.data.data
            this.stockInfo.forEach((val, index) => {
                let yearOne = ''
                if (!this.refreshDate) {
                    this.refreshDate = val['alphaBetaGenDate']
                }
                if (!val['alphaBeta1Year']) {
                    yearOne = { alpha: 0, beta: 0, r2: 0 }
                } else {
                    yearOne = JSON.parse(val['alphaBeta1Year'])
                }
                let yearTwo = ''
                if (!val['alphaBeta2Year']) {
                    yearTwo = { alpha: 0, beta: 0, r2: 0 }
                } else {
                    yearTwo = JSON.parse(val['alphaBeta2Year'])
                }
                this.fstIndData.push({
                    no: index + 1,
                    code: val.code,
                    name: val.name,
                    alpha1: (yearOne.alpha * 100).toFixed(2) + '%',
                    beta1: yearOne.beta.toFixed(4),
                    r1: (yearOne.r2 * 100).toFixed(2) + '%',
                    alpha2: (yearTwo.alpha * 100).toFixed(2) + '%',
                    beta2: yearTwo.beta.toFixed(4),
                    r2: (yearTwo.r2 * 100).toFixed(2) + '%'
                })
            })
        },
        compare (a, b, type) {
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
    async created () {
        // 查询本人的自选股
        const optStockRet = await queryOptStocks()
        if (optStockRet && optStockRet.data && optStockRet.data.code === 1) {
            if (optStockRet.data.data.length > 0) {
                this.optStocks = optStockRet.data.data[0].stock
                this.$store.commit('changeOpStocks', this.optStocks)
            }
        } else {
            this.$Message.error(optStockRet.data.msg)
        }
        await this.queryAlphaBetaData()
    }
}
</script>
<style>
</style>