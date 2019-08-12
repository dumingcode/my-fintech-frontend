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
    </Row>
  </div>
</template>

<script>
// import { isIntNum, isPositiveFloat } from '@/utils/validate'
import canEditTable from '@/views/tables/components/canEditTable.vue'
// import { isNull, deepCopy } from '../../utils/utils'
import { queryRecenetWeekDealInfo } from '../../service/getData'

export default {
    name: 'bjHouse',
    components: { canEditTable },
    data () {
        return {
            loading: false,
            tableData: [],
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