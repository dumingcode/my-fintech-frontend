<style lang="less">
@import "../../styles/common.less";
@import "../tables/components/table.less";
</style>

<template>
  <div>
    <Row>
      <Col span="24" class="padding-left-10 height-100">
      <Card>
        <p slot="title" class="card-title">大数投资持仓行业查询</p>
      </Card>

      <Card>
        <Table refs="profitTable" :data="tableData" :columns-list="columnsList"></Table>
      </Card>
      </Col>

    </Row>

  </div>
</template>

<script>
//  import { getStore } from "../../utils/storageUtil"
import { queryCitiFstIndustryInfo, queryCitiSndIndustryInfo } from '../../service/getData';
export default {
    name: 'industry',
    data () {
        return {
            loading: false,
            tableData: [],
            fstInd: [],
            sndInd: [],
            columnsList: [
                {
                    title: '一级行业',
                    key: 'fstInd',
                    width: 160,
                    align: 'center'
                },
                {
                    title: '个股名称',
                    key: 'name',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '个股代码',
                    key: 'code',
                    width: 120,
                    align: 'center'
                }
            ]
        };
    },
    methods: {
        getIndData () {
            let funcArr = [queryCitiFstIndustryInfo, queryCitiSndIndustryInfo];
            Promise.all(funcArr).then((vals) => {
                this.fstInd = vals[0].data.data;
                this.sndInd = vals[1].data.data;
                this.fstInd.forEach((val) => {
                    this.tableData.push({'fstInd': val});
                });
            });
        }

    },
    created () {
        this.getIndData();
    }
};
</script>
<style>
</style>