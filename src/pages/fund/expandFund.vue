
<template>
    <div>
        <p class="expand-row" v-if="loading">加载中</p>     
        <Row>
            <span class="expand-row">管理费：{{extraFund.Management}}%</span>
            <span class="expand-row">托管费：{{extraFund.Custodial}}%</span>
            <span class="expand-row">赎回费：{{extraFund.Redemption}}</span>
        </Row>
        <Row>
            <span class="expand-row">基金经理：{{extraFund.Managers}}</span>
        </Row>
        <Row>
            <span class="expand-row">投资目标：{{extraFund.Profile}}</span>
        </Row>
        <Row>
            <span class="expand-row">股票比例：{{row.Stock}}%</span>
            <span class="expand-row">债券比例：{{row.Bond}}%</span>
            <span class="expand-row">十大股票比例：{{row.TopStockWeight}}%</span>
            <span class="expand-row">五大债券比例：{{row.TopBondsWeight}}%</span>
        </Row>
        <Row>
            <Table :loading="loading" size="small" :columns="portfolioCol" :data="portfolioData"></Table>
        </Row>
    </div>
</template>
<script>
    import { queryFundExtraInfo } from '../../service/getData'
    export default {
        props: {
            row: Object
        },
    
        data () {
            return {
                loading: false,
                extraFund: {},
                portfolioData: [],
                portfolioCol: [
                    {
                        title: '代码',
                        key: 'Symbol',
                        width: 120,
                        align: 'left'
                    },
                    {
                        title: '名称',
                        key: 'HoldingName',
                        width: 120,
                        align: 'left'
                    },
                    {
                        title: '行业',
                        key: 'SectorName',
                        width: 120,
                        align: 'left'
                    },
                    // {
                    //     title: '市值(元)',
                    //     key: 'MarketValue',
                    //     width: 220,
                    //     align: 'left'
                    // },
                    {
                        title: '占比%',
                        key: 'Percent',
                        width: 120,
                        align: 'left'
                    },
                    {
                        title: '类别',
                        key: 'type',
                        width: 120,
                        align: 'left'
                    }
                ]
            }
        },
        async created () {
            this.loading = true
            const data = await queryFundExtraInfo({ code: this.row.Code, PortfolioEffectiveDate: '2020-03-31' })
            this.loading = false
            this.extraFund = data.data.data
            this.portfolioData = []
            const bondPortfolio = this.extraFund.Top5BondHoldings
            bondPortfolio.forEach(portfolio => {
                portfolio['type'] = '债券'
            })
            const stockPortfolio = this.extraFund.Top10StockHoldings
            stockPortfolio.forEach(portfolio => {
                portfolio['type'] = '股票'
            })
            this.portfolioData = this.portfolioData.concat(bondPortfolio)
            this.portfolioData = this.portfolioData.concat(stockPortfolio)
        },
        methods: {

        }
    }
</script>
<style scoped>
    .expand-row{
        margin-left: 16px;
        margin-top: 6px;
        margin-bottom: 6px;
    }
</style>