<style lang="less">
@import '../../styles/common.less';
@import '../../views/tables/components/table.less';
</style>

<template>
  <div>

    <Row>
      <Col span="24" class="padding-left-10 height-100">
        <Card>
          <p  slot="title" class="card-title">开放式基金检索</p>
        </Card>
        <Card>
          <can-edit-table
            refs="fundTable"
            :editIncell="true"
            :inputType="inputType"
            v-model="tableData"
            :loading="loading"
            :no-data-text="loadingText ? loadingText : '暂无数据'"
            :columns-list="columnsList"
          ></can-edit-table>
           <Page :total="total" :page-size-opts="[10, 20, 30, 40, 50, 100]" @on-change="changeFundPage" @on-page-size-change="changeFundPageSize" :page-size="pageSize" :current="current" style="margin-left:60%;margin-top:20px;" show-sizer />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import canEditTable from '@/views/tables/components/canEditTable.vue'
// import { isIntNum } from '@/utils/validate'
// import { deepCopy } from '../../utils/utils'
import {
    queryFundOutLineInfo
    // queryFundExtraInfo
} from '../../service/getData'
export default {
    name: 'fund',
    components: { canEditTable },
    data () {
        return {
            loading: false,
            inputType: 'textarea',
            tableData: [],
            loadingText: '',
            current: 1,
            total: 0,
            pageSize: 10,
            columnsList: [
                {
                    title: '名称',
                    key: 'FundName',
                    width: 220,
                    align: 'left'
                },
                {
                    title: '代码',
                    key: 'Code',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '类别',
                    key: 'CategoryId',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '基金经理',
                    key: 'ManagerName',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '经理任职时间',
                    key: 'ManagerTime',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '股票比例(%)',
                    key: 'Stock',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '债券比例(%)',
                    key: 'Bond',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '现金比例(%)',
                    key: 'Cash',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2020回报(%)',
                    key: '2020',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2019回报(%)',
                    key: '2019',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2018回报(%)',
                    key: '2018',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2017回报(%)',
                    key: '2017',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2016回报(%)',
                    key: '2016',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2015回报(%)',
                    key: '2015',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2014回报(%)',
                    key: '2014',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2013回报(%)',
                    key: '2013',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '晨星3年评级',
                    key: 'Rating3Year',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '晨星5年评级',
                    key: 'Rating5Year',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '晨星10年评级',
                    key: 'Rating10Year',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '3年年化(%)',
                    key: 'Return3Year',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '5年年化(%)',
                    key: 'Return5Year',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '10年年化(%)',
                    key: 'Return10Year',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '10大股票比例(%)',
                    key: 'TopStockWeight',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '5大债券比例(%)',
                    key: 'TopBondsWeight',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '最差3月回报(%)',
                    key: 'Worst3MonReturn',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '最差6月回报(%)',
                    key: 'Worst6MonReturn',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '成立日期',
                    key: 'InceptionDate',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '操作',
                    align: 'left',
                    fixed: 'right',
                    minWidth: 200,
                    width: 120,
                    key: 'handle',
                    handle: ['delete']
                }
            ]
        }
    },
    methods: {
        async refreshFund () {
            this.loading = true
            this.loadingText = '数据加载中...'
            const param = {
                'queryParameters': [],
                'sortParameters': [{ '2018': 'desc' }],
                'from': (this.current - 1) * this.pageSize,
                'size': this.pageSize
            }
            const retData = await queryFundOutLineInfo(param)
            this.tableData = retData.data.data.data
            this.total = retData.data.data.total
            this.loading = false
        },
        changeFundPage (page) {
            this.current = page
            this.refreshFund()
        },
        changeFundPageSize (pageSize) {
            this.pageSize = pageSize
            this.refreshFund()
        }
    },
    async created () {
        this.refreshFund()
    }
}
</script>
<style>
.ivu-table .demo-table-info-row td {
  background-color: #2db7f5;
  color: #fff;
}
.ivu-table .demo-table-info-row-cell-fall   {
    background-color: #2db7f5;
    color: #fff;
}
.ivu-table .demo-table-info-row-cell-rise {
	background-color: #e08a18;
	color: #fff;
}

</style>