<style lang="less">
@import "../../styles/common.less";
@import "../tables/components/table.less";
</style>

<template>
    <div>
        <Row>
            <Col span="24" class="padding-left-10 height-100">
            <Card>
                <p slot="title" class="card-title">大数投资补仓查询</p>
            </Card>
            <Card>
                <Input v-model="stock" placeholder="输入股票代码" clearable style="width: 300px"></Input>
                <Button type="info" @click="addToOption">添加到自选</Button>
            </Card>

            <Card>
                <p slot="title" class="card-title">
                    自选股补仓表
                </p>
                <can-edit-table refs="coverTable" :row-class-name="isYieldCheap" @on-cell-change="handleYieldCellChange" :editIncell="true" v-model="tableData" :columns-list="columnsList"></can-edit-table>
            </Card>
            </Col>

        </Row>

    </div>
</template>

<script>
import axios from "axios";
import canEditTable from "../tables/components/canEditTable.vue";
export default {
  name: "cover",
  components: { canEditTable },
  data() {
    return {
      stock: "",
      columnsList: [
        {
          title: "个股名称",
          key: "cname",
          width: 120,
          align: "center"
        },
        {
          title: "个股代码",
          key: "pe",
          width: 120,
          align: "center"
        },
        {
          title: "当前时间",
          key: "pb",
          width: 120,
          align: "center"
        },
        {
          title: "现价",
          key: "pb",
          width: 120,
          align: "center"
        },
        {
          title: "目标价",
          key: "pb",
          width: 120,
          align: "center"
        },
        {
          title: "距离补仓点百分比",
          key: "pb",
          width: 120,
          align: "center"
        }
      ]
    };
  },
  methods: {
    async addToOption() {
      console.log(this.stock);
      if(this.stock){
          this.$Message.warning({content:"请输入股票代码"})
          return
      }
      let queryStock = "";
      if (this.stock.startsWith("60")) {
        queryStock = `http://hq.sinajs.cn/list=sh${this.stock}`;
      }
      let stockInfo = await axios.get(
        queryStock
      )
      console.log(stockInfo)
    },
    async getQmDealDate() {
      let lxrDealDate = await axios.get(
        "/api/indexInvest/queryQmIndexDealDate.json"
      );
      this.qmDealDate = lxrDealDate.data.data.substr(0, 10);
    }
  },
  created() {
    // 可在此从服务端获取表格数据
  }
};
</script>
<style>
.ivu-table .demo-table-info-row td {
  background-color: #2db7f5;
  color: #fff;
}
</style>