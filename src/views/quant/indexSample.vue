<style lang="less">
@import '../../styles/common.less';
@import '../../views/tables/components/table.less';
</style>

<template>
  <div>
    <Row>
      <Col span="24" class="padding-left-10 height-100">
        <Card>
          <p slot="title" class="card-title">自选与指数成分股重合度查询</p>
          计算方法： 自选股中对应指数的成分股数量 / 自选股数量
          自选股总数为{{count}}
        </Card>
      </Col>
      <Col span="24" class="padding-left-10 height-200">
        <Card>
          <div style="height:600px;width:100%;">
            <index-sample-chart v-if="sDataOk" :statistic-data="sData"></index-sample-chart>
          </div>
        </Card>
      </Col>
      <Col span="24" class="padding-left-10 height-200">
        <Card>
          <div style="height:600px;width:100%;">
             <can-edit-table  v-model="tableData" :columns-list="columnsList"></can-edit-table>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import canEditTable from '@/views/tables/components/canEditTable.vue'
import indexSampleChart from './echarts/indexSampleChart.vue'
import {
    queryUserIndexSampleInfo,
    queryOptStocks
} from '../../service/getData'

export default {
    name: 'indexSample',
    components: { indexSampleChart, canEditTable },
    data () {
        return {
            loading: false,
            sData: {}, // 查询统计数据
            sDataOk: false,
            count: 0,
            tableData: [],
            columnsList: [
                {
                    title: '指数名称',
                    key: 'indexName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '匹配数量',
                    key: 'num',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '匹配个股明细',
                    key: 'hit_stocks',
                    width: 160,
                    align: 'center'
                }
            ]
        }
    },
    methods: {
        async refreshDeal () {
            this.loading = true
            const optStocks = this.$store.state.user.opStocks
            const data = await queryUserIndexSampleInfo()
            if (data.data.code === 1) {
                const indexData = data.data.data
                this.sData = {}
                this.count = optStocks.split(',').length
                indexData.forEach(element => {
                    element['num'] = (element['num'] / this.count * 100).toFixed(2)

                    this.sData[element.index] = element
                })
                this.sData['count'] = this.count
                this.sDataOk = true
            }
            this.loading = false
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
        await this.refreshDeal()
    }
}
</script>
<style>
</style>