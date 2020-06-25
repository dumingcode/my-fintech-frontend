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
            <Form  :label-width="120" inline>
            <Row>
                <FormItem  style="font-weight:bold" :label-width="60"  label="基本信息">
                </FormItem>
                <FormItem  label="基金名称">
                    <Input  style="width:200px" placeholder="请输入基金名称"></Input>
                </FormItem>
                <FormItem  label="经理姓名">
                    <Input  style="width:200px" placeholder="请输入基金经理姓名"></Input>
                </FormItem>
            </Row>
            
            <Row>
                <FormItem  style="font-weight:bold" :label-width="60">
                </FormItem>
                <FormItem  label="任职起始日期">
                    <DatePicker type="date"  placeholder="基金经理任职起始日期" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem  label="基金成立起始日期">
                    <DatePicker type="date"  placeholder="基金成立起始日期" style="width: 200px"></DatePicker>
                </FormItem>
            </Row>

            <Row>
                    <FormItem  style="font-weight:bold" :label-width="60">
                    </FormItem>
                    <FormItem  label="基金类型">
                        <Select  clearable style="width:200px" placeholder="选择基金类型">
                            <Option value="5" key="5">ma5</Option>
                            <Option value="10" key="10">ma10</Option>
                            <Option value="20" key="20">ma20</Option>
                          </Select>
                    </FormItem>
                    <FormItem  label="三年晨星评级">
                        <Select  clearable style="width:200px" placeholder="三年晨星评级">
                            <Option value="5" key="5">三年晨星评级3星及以上</Option>
                            <Option value="10" key="10">三年晨星评级3星以下</Option>
                          </Select>
                    </FormItem>
            </Row>
            <Row>
                    <FormItem  style="font-weight:bold" :label-width="60">
                    </FormItem>
                    <FormItem  label="五年晨星评级">
                        <Select  clearable style="width:200px" placeholder="五年晨星评级">
                            <Option value="5" key="5">五年晨星评级3星及以上</Option>
                            <Option value="10" key="10">五年晨星评级3星以下</Option>
                          </Select>
                    </FormItem>
                    <FormItem  label="十年晨星评级">
                        <Select  clearable style="width:200px" placeholder="十年晨星评级">
                            <Option value="5" key="5">十年晨星评级3星及以上</Option>
                            <Option value="10" key="10">十  年晨星评级3星以下</Option>
                          </Select>
                    </FormItem>
            </Row>
            <Row>
                <FormItem  style="font-weight:bold" :label-width="60" label="资产配置">
                </FormItem>
                <FormItem  label="股票比例大于">
                    <InputNumber style="width:50px"></InputNumber>
                    小于
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="债券比例大于">
                    <InputNumber style="width:50px"></InputNumber>
                    小于
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
            </Row>
            <Row>
                <FormItem  style="font-weight:bold" :label-width="60">
                </FormItem>
                <FormItem  label="前十大股票比例大于">
                    <InputNumber style="width:50px"></InputNumber>
                    小于
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="前五大债券比例大于">
                    <InputNumber style="width:50px"></InputNumber>
                    小于
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
            </Row>
            <Row>
               
                <FormItem  style="font-weight:bold" :label-width="60" label="年化收益">
                </FormItem>
                <FormItem  label="2020年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="2019年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="2018年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="2017年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
            </Row>
            <Row>
                
                <FormItem  style="font-weight:bold" :label-width="60">
                </FormItem>
                <FormItem  label="2016年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="2015年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="2014年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="2013年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
            </Row>
            
            <Row>
                <FormItem  style="font-weight:bold" :label-width="60">
                </FormItem>
                <FormItem  label="今年以来收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="近三年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="近五年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
                <FormItem  label="近十年收益大于">
                    <InputNumber style="width:50px"></InputNumber>
                </FormItem>
            </Row>
        </Form>  
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
                    title: '2020收益(%)',
                    key: '2020',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2019收益(%)',
                    key: '2019',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2018收益(%)',
                    key: '2018',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2017收益(%)',
                    key: '2017',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2016收益(%)',
                    key: '2016',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2015收益(%)',
                    key: '2015',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2014收益(%)',
                    key: '2014',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '2013收益(%)',
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
                    title: '最差3月收益(%)',
                    key: 'Worst3MonReturn',
                    width: 120,
                    align: 'left'
                },
                {
                    title: '最差6月收益(%)',
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
            this.current = 1
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