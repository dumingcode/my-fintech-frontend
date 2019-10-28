<style lang="less">
@import '../../styles/common.less';
@import '../tables/components/table.less';
</style>

<template>
	<div>
		<Row>
			<Col span="12" class="padding-left-10 height-100">
				<Card>
					<p slot="title" class="card-title">大数投资持仓国证二级行业查询</p>
                    
				</Card>
					
				<Card>
                    <p slot="title" >
						覆盖国证二级行业
						<span style="color:red">{{gz2Num}}</span>/30
					</p>
					<Table stripe :data="fstIndData" :columns="fstColumnsList"></Table>
				</Card>
			</Col>
			<Col span="12" class="padding-left-10 height-100">
				<Card>
					<p slot="title" class="card-title">大数投资持仓国证三级行业查询</p>
				</Card>
				<Card>
                    <p slot="title" class="card-title">
						覆盖国证三级行业
						<span style="color:red">{{gz3Num}}</span>/88
					</p>
					<Table stripe :data="sndIndData" :columns="sndColumnsList"></Table>
				</Card>
			</Col>
		</Row>
	</div>
</template>

<script>
import {
    queryGzSndIndustryInfo,
    queryGzTrdIndustryInfo,
    queryStockIndInfo,
    queryOptStocks
} from '../../service/getData'
export default {
    name: 'industry',
    data () {
        return {
            loading: false,
            fstIndData: [],
            sndIndData: [],
            gz2Num: 0,
            gz3Num: 0,
            fstInd: [],
            sndInd: [],
            stockInfo: [],
            optStocks: '',
            fstColumnsList: [
                {
                    title: '序号',
                    key: 'no',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '国证二级行业',
                    key: 'fstInd',
                    width: 160,
                    align: 'center'
                },
                {
                    title: '个股名称',
                    key: 'name',
                    width: 400,
                    align: 'left'
                }
            ],
            sndColumnsList: [
                {
                    title: '序号',
                    key: 'no',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '国证三级行业',
                    key: 'sndInd',
                    width: 160,
                    align: 'center'
                },
                {
                    title: '个股名称',
                    key: 'name',
                    width: 400,
                    align: 'left'
                }
            ]
        }
    },
    methods: {
        getIndData () {
            this.optStocks = this.$store.state.user.opStocks
            const myStocksStore = this.optStocks
            this.gz2Num = 0
            this.gz3Num = 0
            return Promise.all([
                queryGzSndIndustryInfo(),
                queryGzTrdIndustryInfo(),
                queryStockIndInfo(myStocksStore)
            ]).then(vals => {
                this.fstInd = vals[0].data.data
                this.sndInd = vals[1].data.data
                this.stockInfo = vals[2].data.data
                this.fstInd.forEach((val, index) => {
                    const ind = val.split('|')
                    const indCode = ind[0]
                    const indName = ind[1]
                    let stockName = ''
                    this.stockInfo
                        .map(stock => {
                            return JSON.parse(stock)
                        })
                        .filter(stock => {
                            return indCode === stock.gz2
                        })
                        .map(stock => {
                            return stock.name
                        })
                        .forEach(name => {
                            if (name) {
                                this.gz2Num += 1
                                stockName += `${name} `
                            }
                        })
                    this.fstIndData.push({ no: index + 1, fstInd: indName, name: stockName })
                })
                this.sndInd.forEach((val, index) => {
                    const ind = val.split('|')
                    const indCode = ind[0]
                    const indName = ind[1]
                    let stockName = ''
                    this.stockInfo
                        .map(stock => {
                            return JSON.parse(stock)
                        })
                        .filter(stock => {
                            return indCode === stock.gz3
                        })
                        .map(stock => {
                            return stock.name
                        })
                        .forEach(name => {
                            if (name) {
                                this.gz3Num += 1
                                stockName += `${name} `
                            }
                        })
                    this.sndIndData.push({ no: index + 1, sndInd: indName, name: stockName })
                })
            })
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
        }
        await this.getIndData()
    }
}
</script>
<style>
</style>