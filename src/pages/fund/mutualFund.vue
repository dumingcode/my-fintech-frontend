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
                    <Input  v-model="form.FundName" style="width:200px" placeholder="请输入基金名称"></Input>
                </FormItem>
                <FormItem  label="经理姓名">
                    <Input  v-model="form.ManagerName" style="width:200px" placeholder="请输入基金经理姓名"></Input>
                </FormItem>
            </Row>
            
            <Row>
                <FormItem  style="font-weight:bold" :label-width="60">
                </FormItem>
                <FormItem  label="任职日期早于">
                    <DatePicker v-model="form.ManagerTime" format="yyyy-MM-dd" type="date"  placeholder="任职日期早于" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem  label="基金成立日期早于">
                    <DatePicker v-model="form.InceptionDate" format="yyyy-MM-dd" type="date"  placeholder="基金成立日期早于" style="width: 200px"></DatePicker>
                </FormItem>
            </Row>

            <Row>
                    <FormItem  style="font-weight:bold" :label-width="60">
                    </FormItem>
                    <FormItem  label="基金类型">
                        <Select  v-model="form.CategoryId"  clearable style="width:200px" placeholder="选择基金类型">
                            <Option value="PGSZD1" key="PGSZD1">激进配置型基金</Option>
                            <Option value="PGSZ01" key="PGSZ01">股票型基金</Option>
                            <Option value="PGSZB1" key="PGSZB1">行业股票-医药</Option>
                            <Option value="PGSZC1" key="PGSZC1">行业股票-科技传媒及通讯</Option>
                            <Option value="PGSZA1" key="PGSZA1">沪港深股票型基金</Option>
                            <Option value="PGSZE1" key="PGSZE1">香港股票型基金</Option>
                            <Option value="PGSZF3" key="PGSZF3">灵活配置型基金</Option>
                            <Option value="PGSZC3" key="PGSZC3">标准混合型基金</Option>
                            <Option value="PGSZG3" key="PGSZG3">沪港深混合型基金</Option>
                            <Option value="PGSZD3" key="PGSZD3">保守混合型基金</Option>
                            <Option value="PGSZE3" key="PGSZE3">可转债基金</Option>
                            <Option value="PGSZC2" key="PGSZC2">激进债券型基金</Option>
                            <Option value="PGSZA2" key="PGSZA2">普通债券型基金</Option>
                            <Option value="PGSZD2" key="PGSZD2">纯债基金</Option>
                            <Option value="PGSZB2" key="PGSZB2">短债基金</Option>
                            <Option value="PGSZ04" key="PGSZ04">货币市场基金</Option>
                            <Option value="PGSZM6" key="PGSZM6">市场中性策略</Option>
                            <Option value="PGSZ0F" key="PGSZ0F">商品</Option>
                            <Option value="PGSZ0X" key="PGSZ0X">其他</Option>
                          </Select>
                    </FormItem>
                    <FormItem  label="三年晨星评级">
                        <Select v-model="form.Rating3Year" clearable style="width:200px" placeholder="三年晨星评级">
                            <Option value="1" key="Rating3Year1">三年晨星评级3星及以上</Option>
                            <Option value="2" key="Rating3Year2">三年晨星评级3星以下</Option>
                          </Select>
                    </FormItem>
            </Row>
            <Row>
                    <FormItem  style="font-weight:bold" :label-width="60">
                    </FormItem>
                    <FormItem  label="五年晨星评级">
                        <Select  v-model="form.Rating5Year" clearable style="width:200px" placeholder="五年晨星评级">
                            <Option value="1" key="Rating5Year5">五年晨星评级3星及以上</Option>
                            <Option value="2" key="Rating5Year10">五年晨星评级3星以下</Option>
                          </Select>
                    </FormItem>
                    <FormItem  label="十年晨星评级">
                        <Select  v-model="form.Rating10Year" clearable style="width:200px" placeholder="十年晨星评级">
                            <Option value="1" key="Rating10Year5">十年晨星评级3星及以上</Option>
                            <Option value="2" key="Rating10Year10">十  年晨星评级3星以下</Option>
                          </Select>
                    </FormItem>
            </Row>
            <Row>
                <FormItem  style="font-weight:bold" :label-width="60" label="资产配置">
                </FormItem>
                <FormItem  label="股票比例大于(%)">
                    <Input v-model="form.gtStock" style="width:50px"></Input>
                    小于(%)
                    <Input v-model="form.ltStock" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="债券比例大于(%)">
                    <Input v-model="form.gtBond" style="width:50px"></Input>
                    小于(%)
                    <Input v-model="form.ltBond" style="width:50px"></Input>
                </FormItem>
            </Row>
            <Row>
                <FormItem  style="font-weight:bold" :label-width="60">
                </FormItem>
                <FormItem  label="重仓股票比例大于">
                    <Input  v-model="form.gtTopStockWeight" style="width:50px"></Input>
                    小于(%)
                    <Input  v-model="form.ltTopStockWeight" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="重仓债券比例大于">
                    <Input v-model="form.gtTopBondsWeight" style="width:50px"></Input>
                    小于(%)
                    <Input v-model="form.ltTopBondsWeight" style="width:50px"></Input>
                </FormItem>
            </Row>
            <Row>
               
                <FormItem  style="font-weight:bold" :label-width="60" label="年化收益">
                </FormItem>
                <FormItem  label="2020年收益大于(%)">
                    <Input v-model="form.gt2020" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="2019年收益大于(%)">
                    <Input v-model="form.gt2019" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="2018年收益大于(%)">
                    <Input v-model="form.gt2018" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="2017年收益大于(%)">
                    <Input v-model="form.gt2017" style="width:50px"></Input>
                </FormItem>
            </Row>
            <Row>
                <FormItem  style="font-weight:bold" :label-width="60">
                </FormItem>
                <FormItem  label="2016年收益大于(%)">
                    <Input  v-model="form.gt2016" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="2015年收益大于(%)">
                    <Input  v-model="form.gt2015" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="2014年收益大于(%)">
                    <Input  v-model="form.gt2014" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="2013年收益大于(%)">
                    <Input  v-model="form.gt2013" style="width:50px"></Input>
                </FormItem>
            </Row>
            
            <Row>
                <FormItem  style="font-weight:bold" :label-width="60">
                </FormItem>
                <FormItem  label="今年收益大于(%)">
                    <Input v-model="form.gt2020" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="近三年收益大于(%)">
                    <Input v-model="form.Return3Year" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="近五年收益大于(%)">
                    <Input v-model="form.Return5Year" style="width:50px"></Input>
                </FormItem>
                <FormItem  label="近十年收益大于(%)">
                    <Input v-model="form.Return10Year" style="width:50px"></Input>
                </FormItem>
            </Row>
            <Row>
                <Button type="default" size="large" style="margin-left:200px;" @click="reset">重置</Button>
                <Button type="primary" size="large" style="margin-left:40px;width:200px;" @click="queryFund">查询</Button>
                
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
            :noDataText="loadingText"
            :columns-list="columnsList"
          ></can-edit-table>
          <Page show-total :total="total" :page-size-opts="[10, 20, 30, 40, 50, 100]" @on-change="changeFundPage" @on-page-size-change="changeFundPageSize" :page-size="pageSize" :current="current" style="margin-left:60%;margin-top:20px;" show-sizer />
        
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import canEditTable from '@/views/tables/components/canEditTable.vue'
// import { isIntNum } from '@/utils/validate'
import { formatDate } from '../../utils/utils'
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
            form: {},
            matchPhrase: {
                'FundName': 'FundName',
                'ManagerName': 'ManagerName'
            },
            rangeParam: {
                'InceptionDate': 'InceptionDate',
                'ManagerTime': 'ManagerTime',
                'Bond': 'Bond',
                'Stock': 'Stock'
            },
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
                    handle: ['']
                }
            ]
        }
    },
    methods: {
        async queryFund () {
            this.current = 1
            await this.refreshFund()
        },
        async refreshFund () {
            this.loading = true
            this.loadingText = '数据加载中...'
            const arr = []
            if (this.form.InceptionDate) {
                arr.push({ 'range': { 'InceptionDate': { 'lte': formatDate(this.form.InceptionDate) }}})
            }
            if (this.form.ManagerTime) {
                arr.push({ 'range': { 'ManagerTime': { 'lte': formatDate(this.form.ManagerTime) }}})
            }
            if (this.form.FundName) {
                arr.push({ 'match_phrase': { 'FundName': this.form.FundName }})
            }
            if (this.form.ManagerName) {
                arr.push({ 'match_phrase': { 'ManagerName': this.form.ManagerName }})
            }
            if (this.form.CategoryId) {
                arr.push({ 'match': { 'CategoryId.keyword': this.form.CategoryId }})
            }

            if (this.form.gt2013) {
                arr.push({ 'range': { '2013': { 'gte': this.form.gt2013 }}})
            }
            if (this.form.gt2014) {
                arr.push({ 'range': { '2014': { 'gte': this.form.gt2014 }}})
            }
            if (this.form.gt2015) {
                arr.push({ 'range': { '2015': { 'gte': this.form.gt2015 }}})
            }
            if (this.form.gt2016) {
                arr.push({ 'range': { '2016': { 'gte': this.form.gt2016 }}})
            }
            if (this.form.gt2017) {
                arr.push({ 'range': { '2017': { 'gte': this.form.gt2017 }}})
            }
            if (this.form.gt2018) {
                arr.push({ 'range': { '2018': { 'gte': this.form.gt2018 }}})
            }
            if (this.form.gt2019) {
                arr.push({ 'range': { '2019': { 'gte': this.form.gt2019 }}})
            }
            if (this.form.gt2020) {
                arr.push({ 'range': { '2020': { 'gte': this.form.gt2020 }}})
            }
            if (this.form.Rating3Year) {
                arr.push({ 'range': { 'Rating3Year': this.form.Rating3Year === '1' ? { 'gte': 3 } : { 'lt': 3 }}})
            }
            if (this.form.Rating5Year) {
                arr.push({ 'range': { 'Rating5Year': this.form.Rating5Year === '1' ? { 'gte': 3 } : { 'lt': 3 }}})
            }
            if (this.form.Rating10Year) {
                arr.push({ 'range': { 'Rating10Year': this.form.Rating10Year === '1' ? { 'gte': 3 } : { 'lt': 3 }}})
            }
            if (this.form.Return3Year) {
                arr.push({ 'range': { 'Return3Year': { 'gte': this.form.Return3Year }}})
            }
            if (this.form.Return5Year) {
                arr.push({ 'range': { 'Return5Year': { 'gte': this.form.Return5Year }}})
            }
            if (this.form.Return10Year) {
                arr.push({ 'range': { 'Return10Year': { 'gte': this.form.Return10Year }}})
            }

            if (this.form.gtBond || this.form.ltBond) {
                const rObj = {}
                if (this.form.gtBond) {
                    rObj['gte'] = this.form.gtBond
                }
                if (this.form.ltBond) {
                    rObj['lt'] = this.form.ltBond
                }
                arr.push({ 'range': { 'Bond': rObj }})
            }
            if (this.form.gtStock || this.form.ltStock) {
                const rObj = {}
                if (this.form.gtStock) {
                    rObj['gte'] = this.form.gtStock
                }
                if (this.form.ltStock) {
                    rObj['lt'] = this.form.ltStock
                }
                arr.push({ 'range': { 'Stock': rObj }})
            }
            if (this.form.gtTopStockWeight || this.form.ltTopStockWeight) {
                const rObj = {}
                if (this.form.gtTopStockWeight) {
                    rObj['gte'] = this.form.gtTopStockWeight
                }
                if (this.form.ltTopStockWeight) {
                    rObj['lt'] = this.form.ltTopStockWeight
                }
                arr.push({ 'range': { 'TopStockWeight': rObj }})
            }
            if (this.form.gtTopBondsWeight || this.form.ltTopBondsWeight) {
                const rObj = {}
                if (this.form.gtTopBondsWeight) {
                    rObj['gte'] = this.form.gtTopBondsWeight
                }
                if (this.form.ltTopBondsWeight) {
                    rObj['lt'] = this.form.ltTopBondsWeight
                }
                arr.push({ 'range': { 'TopBondsWeight': rObj }})
            }
            // arr.push({ 'match': param })

            const param = {
                'queryParameters': arr,
                'sortParameters': [{ '2018': 'desc' }],
                'from': (this.current - 1) * this.pageSize,
                'size': this.pageSize
            }
            const retData = await queryFundOutLineInfo(param)
            this.tableData = retData.data.data.data
            this.total = retData.data.data.total
            this.loading = false
            this.loadingText = ''
        },
        changeFundPage (page) {
            this.current = page
            this.refreshFund()
        },
        changeFundPageSize (pageSize) {
            this.pageSize = pageSize
            this.current = 1
            this.refreshFund()
        },
        reset () {
            this.form = {}
        }
    },
    async created () {
        this.reset()
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