<style lang="less">
@import '../../styles/common.less';
@import '../../views/tables/components/table.less';
</style>

<template>
  <div>
    <Row>
      <Col span="24" class="padding-left-10 height-100">
        <Card>
          <p slot="title" class="card-title">最近7日网签</p>
          <can-edit-table :editIncell="true" v-model="tableData" :columns-list="columnsList"></can-edit-table>
        </Card>
      </Col>
      <Col span="24" class="padding-left-10 height-200">
        <Card>
          <p slot="title" class="card-title">历年成交数据</p>

          <div style="height:600px;width:100%;">
            <house-chart v-if="sDataOk" :statistic-data="sData"></house-chart>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import { isIntNum, isPositiveFloat } from '@/utils/validate'
import canEditTable from '@/views/tables/components/canEditTable.vue'
import houseChart from './echarts/houseChart.vue'
import { objToArr } from '../../utils/utils'
import {
    queryRecenetWeekDealInfo,
    queryYearDealInfo
} from '../../service/getData'

export default {
    name: 'bjHouse',
    components: { canEditTable, houseChart },
    data () {
        return {
            loading: false,
            tableData: [],
            sData: {}, // 查询统计数据
            sDataOk: false,
            columnsList: [
                {
                    title: '日期',
                    key: 'date',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '网上签约数量',
                    key: 'onlineNum',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '网上签约面积',
                    key: 'onlineSquare',
                    width: 160,
                    align: 'center'
                },
                {
                    title: '住宅签约数量',
                    key: 'houseNum',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '住宅签约面积',
                    key: 'houseSquare',
                    width: 160,
                    align: 'center'
                }
            ]
        }
    },
    methods: {
        async refreshDeal () {
            this.loading = true
            const data = await queryRecenetWeekDealInfo()
            if (data.data.code === 1) {
                this.tableData = JSON.parse(data.data.data).reverse()
            }
            const thisYear = dayjs().year()
            const funcArr = []
            for (let i = 2016; i <= thisYear; i++) {
                funcArr.push(queryYearDealInfo({ year: i }))
            }
            // funcArr = funcArr.reverse()
            Promise.all(funcArr).then(values => {
                values.forEach((val, index) => {
                    const yearData = JSON.parse(val.data.data)
                    this.sData[`${2016 + index}`] = objToArr(yearData).slice(1)
                })
                this.sDataOk = true
            })
            this.loading = false
        }
    },

    created () {
        this.refreshDeal()
    }
}
</script>
<style>
</style>