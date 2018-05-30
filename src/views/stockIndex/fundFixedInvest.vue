<style lang="less">
@import "../../styles/common.less";
@import "../tables/components/table.less";
</style>

<template>
  <div>
    <Row>
      <Col span="24" class="padding-left-10 height-100">

      <Card>
        <p slot="title" class="card-title">
          {{dealDate}}盈利收益率法估值定投
          <Icon type="help" title="定投基准金额 * 定投倍数 * (10/pe)"></Icon>
        </p>

        <can-edit-table refs="yieldTable" :row-class-name="isYieldCheap"  @on-cell-change="handleYieldCellChange" :editIncell="true" v-model="tableData" :columns-list="columnsList"></can-edit-table>

      </Card>
      </Col>

    </Row>
    <Row>
      <Col span="24" class="padding-left-10 height-100">
      <Card>
        <p slot="title" class="card-title">
          {{dealDate}}博格公式法估值定投-PE
          <Icon type="help" title="定投基准金额 * 定投倍数 * (pe机会值 / 当前pe)"></Icon>
        </p>

        <can-edit-table refs="peTable" :row-class-name="isPeCheap" @on-cell-change="handlePeCellChange" :editIncell="true" v-model="pePosTableData" :columns-list="columnsList"></can-edit-table>

      </Card>
      </Col>

    </Row>
    <Row>
      <Col span="24" class="padding-left-10 height-100">
      <Card>
        <p slot="title" class="card-title">
          {{dealDate}}博格公式法估值定投-PB
          <Icon type="help" title="定投基准金额 * 定投倍数 * (pb机会值 / 当前pb)"></Icon>
        </p>
        <!-- <Table  :data="pbPosTableData" :columns="columnsList"></Table> -->
        <can-edit-table refs="pbTable" :row-class-name="isPbCheap" @on-cell-change="handlePbCellChange" :editIncell="true" v-model="pbPosTableData" :columns-list="columnsList"></can-edit-table>

      </Card>
      </Col>

    </Row>

  </div>
</template>

<script>
import axios from "axios";
import canEditTable from "../tables/components/canEditTable.vue";
export default {
  name: "dragable-table",
  components: { canEditTable },
  data() {
    return {
      columnsList: [
        {
          title: "指数名称",
          key: "cname",
          width: 120,
          align: "center"
        },
        {
          title: "pe",
          key: "pe",
          width: 80,
          align: "center"
        },
        {
          title: "pb",
          key: "pb",
          width: 80,
          align: "center"
        },
        {
          title: "pe百分位",
          key: "pe_pos",
          width: 120,
          align: "center"
        },
        {
          title: "pb百分位",
          key: "pb_pos",
          width: 120,
          align: "center"
        },
        {
          title: "定投倍数",
          key: "dtbs",
          width: 160,
          align: "center",
          editable: true
        },
        {
          title: "机会值(20%百分位)",
          key: "chanceVal",
          width: 120,
          align: "center"
        },
        {
          title: "定投基准金额",
          key: "baseMoney",
          width: 160,
          align: "center",
          editable: true
        },
        {
          title: "本期定投金额",
          key: "curMoney",
          width: 120,
          align: "center"
        }
      ],
      dealDate: "",
      tableData: [],
      pePosTableData: [],
      pbPosTableData: [],
      yieldCalcIndex: [
        "399550",
        "10002",
        "000015",
        "000925",
        "000922",
        "000300"
      ],
      pePosCalcIndex: ["399812", "399971", "000827", "000905"],
      pbPosCalcIndex: ["399395", "399998", "399393", "399975", "399986"]
    };
  },
  methods: {
    isPbCheap(row, index) {
      if (row['pb'] < row['chanceVal']) {
        return "demo-table-info-row";
      } 
      return "";
    },
     isPeCheap(row, index) {
      if (row['pe'] < row['chanceVal']) {
        return "demo-table-info-row";
      } 
      return "";
    },
     isYieldCheap(row, index) {
      if (row['pe'] < 10) {
        return "demo-table-info-row";
      } 
      return "";
    },
    handlePbCellChange(val, index, key) {
      let pbObj = this.pbPosTableData[index];
      pbObj["curMoney"] = (
        pbObj["dtbs"] *
        pbObj["baseMoney"] *
        (pbObj["chanceVal"] / pbObj["pb"])
      ).toFixed(0);
    },
    handlePeCellChange(val, index, key) {
      let peObj = this.pePosTableData[index];
      peObj["curMoney"] = (
        peObj["dtbs"] *
        peObj["baseMoney"] *
        (peObj["chanceVal"] / peObj["pe"])
      ).toFixed(0);
    },
    handleYieldCellChange(val, index, key) {
      let yieldObj = this.tableData[index];
      yieldObj["curMoney"] = (
        yieldObj["dtbs"] *
        yieldObj["baseMoney"] *
        (10 / yieldObj["pe"])
      ).toFixed(0);
    },

    composeIndexData(stockIndex) {
      stockIndex["baseMoney"] = 1000;
      stockIndex["pe"] = stockIndex["pe"].toFixed(2);
      stockIndex["pb"] = stockIndex["pb"].toFixed(2);
      stockIndex["pe_pos"] =
        (stockIndex["pe_pos"].toFixed(2) * 100).toFixed(0) + "%";
      stockIndex["pb_pos"] =
        (stockIndex["pb_pos"].toFixed(2) * 100).toFixed(0) + "%";
    },
    async getDealDate() {
      let lxrDealDate = await axios.get(
        "/api/indexInvest/queryLxrIndexDealDate.json"
      );
      this.dealDate = lxrDealDate.data.data.substr(0, 10);
    },
    async getIndexData() {
      let lxrIndexAllData = await axios.get(
        "/api/indexInvest/queryLxrIndexAllData.json"
      );
      let indexObj = JSON.parse(lxrIndexAllData.data.data);
      this.yieldCalcIndex.forEach(element => {
        let stockIndex = indexObj[element];
        if (!stockIndex) return;
        stockIndex["dtbs"] = 1;
        stockIndex["chanceVal"] = stockIndex.pe_chance_val.toFixed(2);
        stockIndex["curMoney"] = (
          10000 *
          stockIndex["dtbs"] /
          stockIndex.pe
        ).toFixed(0);
        this.composeIndexData(stockIndex);
        this.tableData.push(stockIndex);
      });
      this.pePosCalcIndex.forEach(element => {
        let stockIndex = indexObj[element];
        if (!stockIndex) return;
        stockIndex["dtbs"] = 1;
        stockIndex["chanceVal"] = stockIndex.pe_chance_val.toFixed(2);
        stockIndex["curMoney"] = (
          1000 *
          stockIndex["dtbs"] *
          (stockIndex.pe_chance_val / stockIndex.pe)
        ).toFixed(0);
        this.composeIndexData(stockIndex);
        this.pePosTableData.push(stockIndex);
      });
      this.pbPosCalcIndex.forEach(element => {
        let stockIndex = indexObj[element];
        if (!stockIndex) return;
        stockIndex["dtbs"] = 1;
        stockIndex["chanceVal"] = stockIndex.pb_chance_val.toFixed(2);
        stockIndex["curMoney"] = (
          1000 *
          stockIndex["dtbs"] *
          (stockIndex.pb_chance_val / stockIndex.pb)
        ).toFixed(0);
        this.composeIndexData(stockIndex);
        this.pbPosTableData.push(stockIndex);
      });
    }
  },
  created() {
    // 可在此从服务端获取表格数据
    this.getIndexData();
    this.getDealDate();
  }
};
</script>
<style>
 .ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
    }
</style>