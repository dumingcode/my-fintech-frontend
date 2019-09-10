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
        </Card>
      </Col>
      <Col span="24" class="padding-left-10 height-200">
        <Card>
          <div style="height:600px;width:100%;">
            <index-sample-chart v-if="sDataOk" :statistic-data="sData"></index-sample-chart>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import indexSampleChart from './echarts/indexSampleChart.vue'
import {
    queryUserIndexSampleInfo
} from '../../service/getData'

export default {
    name: 'indexSample',
    components: { indexSampleChart },
    data () {
        return {
            loading: false,
            sData: {}, // 查询统计数据
            sDataOk: false
        }
    },
    methods: {
        async refreshDeal () {
            this.loading = true
            const data = await queryUserIndexSampleInfo()
            console.log(data.data.data)
            if (data.data.code === 1) {
                const indexData = data.data.data
                this.sData = {}
                indexData.forEach(element => {
                    this.sData[element.index] = element
                })
                this.sDataOk = true
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