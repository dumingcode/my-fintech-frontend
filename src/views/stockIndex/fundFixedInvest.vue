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
                    盈利收益率法估值定投
                     <Icon type="help" title="定投基准金额 * 定投倍数 * (10/pe)"></Icon>
                </p>
                <Table border :data="tableData" :columns="columnsList"></Table>
            </Card>
            </Col>

        </Row>
        <Row>
            <Col span="24" class="padding-left-10 height-100">
            <Card>
                <p slot="title" class="card-title">
                    博格公式法估值定投-PE百分位
                    <Icon type="help" title="定投基准金额 * 定投倍数 * (pe机会值 / 当前pe)"></Icon>
                </p>
                <Table border :data="pePosTableData" :columns="columnsList"></Table>
            </Card>
            </Col>

        </Row>
         <Row>
            <Col span="24" class="padding-left-10 height-100">
            <Card>
                <p slot="title" class="card-title">
                    博格公式法估值定投-PB百分位
                     <Icon type="help" title="定投基准金额 * 定投倍数 * (pb机会值 / 当前pb)"></Icon>
                </p>
                <Table border :data="pbPosTableData" :columns="columnsList"></Table>
            </Card>
            </Col>

        </Row>

    </div>
</template>

<script>
import axios from "axios";
export default {
  name: "dragable-table",
  components: {},
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
          width: 120,
          align: "center"
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
          width: 120,
          align: "center"
        },
        {
          title: "本期定投金额",
          key: "curMoney",
          width: 120,
          align: "center"
        }
      ],
      tableData: [],
      pePosTableData:[],
      pbPosTableData:[],      
      yieldCalcIndex: ['399550','10002', '000015',"000925", "000922", "000300"],
      pePosCalcIndex: ["399812", "399971", "000827", "000905"],
      pbPosCalcIndex: ['399395','399998','399393',"399975", "399986"]
    };
  },
  methods: {
    composeIndexData(stockIndex) {
      stockIndex["baseMoney"] = 1000;      
      stockIndex["pe"] = stockIndex["pe"].toFixed(2);
      stockIndex["pb"] = stockIndex["pb"].toFixed(2);
      stockIndex["pe_pos"] = (stockIndex["pe_pos"].toFixed(2) * 100).toFixed(0) + "%";
      stockIndex["pb_pos"] = (stockIndex["pb_pos"].toFixed(2) * 100).toFixed(0) + "%";
    },

    async getIndexData() {
      let lxrIndexAllData = await axios.get(
        "/api/indexInvest/queryLxrIndexAllData.json"
      );
      let indexObj = JSON.parse(lxrIndexAllData.data.data);
      this.yieldCalcIndex.forEach(element => {
        let stockIndex = indexObj[element]
        if(!stockIndex) return
        stockIndex['dtbs'] = 1;
        stockIndex['chanceVal']=stockIndex.pe_chance_val.toFixed(2)
        stockIndex["curMoney"] = (10000 * stockIndex["dtbs"] / stockIndex.pe).toFixed(0);
        this.composeIndexData(stockIndex)
        this.tableData.push(stockIndex);
      });
      this.pePosCalcIndex.forEach(element => {
        let stockIndex = indexObj[element]
        if(!stockIndex) return
        stockIndex["dtbs"] = 1
        stockIndex['chanceVal']=stockIndex.pe_chance_val.toFixed(2)
        stockIndex["curMoney"] = (1000 * stockIndex["dtbs"] * (stockIndex.pe_chance_val/stockIndex.pe)).toFixed(0)
        this.composeIndexData(stockIndex)
        this.pePosTableData.push(stockIndex);
      });
       this.pbPosCalcIndex.forEach(element => {
        let stockIndex = indexObj[element]
        if(!stockIndex) return
        stockIndex["dtbs"] = 1
        stockIndex['chanceVal']=stockIndex.pb_chance_val.toFixed(2)
        stockIndex["curMoney"] = (1000 * stockIndex["dtbs"] * (stockIndex.pb_chance_val/stockIndex.pb)).toFixed(0)
        this.composeIndexData(stockIndex)
        this.pbPosTableData.push(stockIndex);
      });
    }
  },
  created() {
    // 可在此从服务端获取表格数据
    this.getIndexData();
  }
};
</script>
