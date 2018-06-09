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
          <Icon type="help" title="机会值(PE=10)与最小值之间均分成10份，当前值若等于机会值则投基准金额，当前值若等于或小于最小值则投2倍基准金额，其余则根据当前值在机会值和最小值之间所处位置等比例换算定投金额"></Icon>
        </p>

        <can-edit-table refs="yieldTable" :row-class-name="isYieldCheap" @on-cell-change="handleYieldCellChange" :editIncell="true"
          v-model="tableData" :columns-list="columnsList"></can-edit-table>

      </Card>
      </Col>

    </Row>
    <Row>
      <Col span="24" class="padding-left-10 height-100">
      <Card>
        <p slot="title" class="card-title">
          {{dealDate}}博格公式法估值定投-PE
          <Icon type="help" title="机会值与最小值之间均分成10份，当前值若等于机会值则投基准金额，当前值若等于或小于最小值则投2倍基准金额，其余则根据当前值在机会值和最小值之间所处位置等比例换算定投金额"></Icon>

        </p>

        <can-edit-table refs="peTable" :row-class-name="isPeCheap" @on-cell-change="handlePeCellChange" :editIncell="true" v-model="pePosTableData"
          :columns-list="columnsList"></can-edit-table>

      </Card>
      </Col>

    </Row>
    <Row>
      <Col span="24" class="padding-left-10 height-100">
      <Card>
        <p slot="title" class="card-title">
          {{dealDate}}博格公式法估值定投-PB
          <Icon type="help" title="机会值与最小值之间均分成10份，当前值若等于机会值则投基准金额，当前值若等于或小于最小值则投2倍基准金额，其余则根据当前值在机会值和最小值之间所处位置等比例换算定投金额"></Icon>

        </p>
        <!-- <Table  :data="pbPosTableData" :columns="columnsList"></Table> -->
        <can-edit-table refs="pbTable" :row-class-name="isPbCheap" @on-cell-change="handlePbCellChange" :editIncell="true" v-model="pbPosTableData"
          :columns-list="columnsList"></can-edit-table>

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
            width: 80,
            align: "center"
          },
          {
            title: "pb百分位",
            key: "pb_pos",
            width: 80,
            align: "center"
          },
          {
            title: "机会值(20%百分位)",
            key: "chanceVal",
            width: 120,
            align: "center",
            editable: true
          },
          {
            title: "最小值",
            key: "minVal",
            width: 120,
            align: "center",
            editable: true
          },
          {
            title: "定投基准金额",
            key: "baseMoney",
            width: 120,
            align: "center",
            editable: true
          },
          {
            title: "本期定投金额",
            key: "curMoney",
            width: 80,
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
          "000922"
        ],
        pePosCalcIndex: ["399812", "399971", "000827", "000905","000300"],
        pbPosCalcIndex: ["399395", "399998", "399393", "399975", "399986"]
      };
    },
    methods: {
      isPbCheap(row, index) {
        if (row['pb_pos'].replace("%", "") <= 20) {
          return "demo-table-info-row";
        }
        return "";
      },
      isPeCheap(row, index) {
        if (row['pe_pos'].replace("%", "") <= 20) {
          return "demo-table-info-row";
        }
        return "";
      },
      isYieldCheap(row, index) {
        if (row['pe'] <= 10) {
          return "demo-table-info-row";
        }
        return "";
      },
      handlePbCellChange(val, index, key) {
        let pbObj = this.pbPosTableData[index];

        pbObj["curMoney"] = this.calcDtje(pbObj["baseMoney"], 10, pbObj["chanceVal"], pbObj["minVal"], pbObj["pb"])
      },
      handlePeCellChange(val, index, key) {
        let peObj = this.pePosTableData[index];
        peObj["curMoney"] = this.calcDtje(peObj["baseMoney"], 10, peObj["chanceVal"], peObj["minVal"], peObj["pe"])
      },
      handleYieldCellChange(val, index, key) {
        let yieldObj = this.tableData[index];
        yieldObj["curMoney"] = this.calcDtje(yieldObj["baseMoney"], 10, 10, yieldObj["minVal"], yieldObj["pe"])
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
          stockIndex["minVal"] = stockIndex.pe_min_val.toFixed(2);
          stockIndex["chanceVal"] = 10.00;
          stockIndex["curMoney"] = this.calcDtje(1000, 10, 10, stockIndex.pe_min_val, stockIndex.pe)
          this.composeIndexData(stockIndex);
          this.tableData.push(stockIndex);
        });
        this.pePosCalcIndex.forEach(element => {
          let stockIndex = indexObj[element];
          if (!stockIndex) return;
          stockIndex["dtbs"] = 1;
          stockIndex["chanceVal"] = stockIndex.pe_chance_val.toFixed(2);
          stockIndex["minVal"] = stockIndex.pe_min_val.toFixed(2);
          stockIndex["curMoney"] = this.calcDtje(1000, 10, stockIndex.pe_chance_val, stockIndex.pe_min_val, stockIndex.pe)
          this.composeIndexData(stockIndex);
          this.pePosTableData.push(stockIndex);
        });
        this.pbPosCalcIndex.forEach(element => {
          let stockIndex = indexObj[element];
          if (!stockIndex) return;
          stockIndex["dtbs"] = 1;
          stockIndex["chanceVal"] = stockIndex.pb_chance_val.toFixed(2);
          stockIndex["minVal"] = stockIndex.pb_min_val.toFixed(2);
          stockIndex["curMoney"] = this.calcDtje(1000, 10, stockIndex.pb_chance_val, stockIndex.pb_min_val, stockIndex.pb)
          this.composeIndexData(stockIndex);
          this.pbPosTableData.push(stockIndex);
        });
      },
      calcDtje(baseMoney1, baseGap1, chanceVal1, minVal1, curVal1) {
        let chanceVal = Number(chanceVal1)
        let minVal = Number(minVal1)
        let curVal = Number(curVal1)
        let baseGap = Number(baseGap1)
        let baseMoney = Number(baseMoney1)
        if (chanceVal < minVal || minVal < 0 || chanceVal < 0) {
          this.$Message.error('最小值应小于机会值');
          return 'error'
        }

        let gap = Math.abs((chanceVal - minVal) / baseGap)
        let access = baseMoney / baseGap * (Math.round((chanceVal - curVal) / gap)).toFixed(0)
        access = access > baseMoney ? baseMoney : access
        access = access < -baseMoney ? -baseMoney : access
        return baseMoney + access
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
  .ivu-table .demo-table-info-row td {
    background-color: #2db7f5;
    color: #fff;
  }
</style>