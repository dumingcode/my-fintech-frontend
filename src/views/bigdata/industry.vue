<style lang="less">
@import '../../styles/common.less';
@import '../tables/components/table.less';
</style>

<template>
	<div>
		<Row>
			<Col span="12" class="padding-left-10 height-100">
				<Card>
					<p slot="title" class="card-title">大数投资持仓中信一级行业查询</p>
				</Card>
				<Card>
					<Table stripe :data="fstIndData" :columns="fstColumnsList"></Table>
				</Card>
			</Col>
			<Col span="12" class="padding-left-10 height-100">
				<Card>
					<p slot="title" class="card-title">大数投资持仓中信二级行业查询</p>
				</Card>
				<Card>
					<Table stripe :data="sndIndData" :columns="sndColumnsList"></Table>
				</Card>
			</Col>
		</Row>
	</div>
</template>

<script>
import {
    queryCitiFstIndustryInfo,
    queryCitiSndIndustryInfo,
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
                    title: '一级行业',
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
                    title: '二级行业',
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
            return Promise.all([
                queryCitiFstIndustryInfo(),
                queryCitiSndIndustryInfo(),
                queryStockIndInfo(myStocksStore)
            ]).then(vals => {
                this.fstInd = vals[0].data.data
                this.sndInd = vals[1].data.data
                this.stockInfo = vals[2].data.data

                this.fstInd.forEach((val, index) => {
                    let stockName = ''
                    this.stockInfo
                        .map(stock => {
                            return JSON.parse(stock)
                        })
                        .filter(stock => {
                            return val === stock.citiV1
                        })
                        .map(stock => {
                            return stock.name
                        })
                        .forEach(name => {
                            stockName += `${name} `
                        })
                    this.fstIndData.push({ no: index + 1, fstInd: val, name: stockName })
                })
                this.sndInd.forEach((val, index) => {
                    let stockName = ''
                    this.stockInfo
                        .map(stock => {
                            return JSON.parse(stock)
                        })
                        .filter(stock => {
                            return val === stock.citiV2
                        })
                        .map(stock => {
                            return stock.name
                        })
                        .forEach(name => {
                            stockName += `${name} `
                        })
                    this.sndIndData.push({ no: index + 1, sndInd: val, name: stockName })
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