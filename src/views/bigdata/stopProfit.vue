<style lang="less">
@import "../../styles/common.less";
@import "../tables/components/table.less";
</style>

<template>
  <div>
    <Row>
      <Col span="24" class="padding-left-10 height-100">
      <Card>
        <p slot="title" class="card-title">大数投资止盈查询</p>
        本页面输入的数据都存储在chrome浏览器本地存储中（服务器不会存储任何用户数据），数据无法跨PC共享。<br/>

      </Card>
      <Card>
        <Input v-model="stock" type="textarea" :rows="4" placeholder="输入实例(逗号间隔):600010,002013,002011" clearable style="width: 40%"></Input>
        <Button type="success" @click="addToOption">添加到自选</Button>
        <Button type="success" :loading="loading" @click="refreshMyStock">刷新实时价格</Button>
      </Card>

      <Card>
        <p slot="title" class="card-title">
          自选股止盈表------数量{{tableData.length}}--------覆盖中信一级行业<span style="color:red">{{citics1VNum}}</span>/29-------覆盖中信二级行业<span style="color:red">{{citics2VNum}}</span>/83-----距离止盈点平均值<span style="color:red">{{avgPos}}</span>
        </p>
      </Card>
      <Card>
        <span style="font-weight:bold">首次止盈点选择</span>
        <Select v-model="firstProfit" style="width:200px" @on-change="changeFirstProfit">
          <Option value="50" key="50">一年最低点上涨50%</Option>
          <Option value="100" key="100">一年最低点上涨100%</Option>
        </Select>

        <span>
          默认补仓规则：一年内最低点涨幅50%、100%、200%、300%分别止盈。
        </span>
      </Card>
      <Card>
        <can-edit-table @on-delete="handleDel" refs="profitTable" :row-class-name="isBelowThreshld" @on-cell-change="handleTargetPriceChange" :editIncell="true" v-model="tableData" :columns-list="columnsList"></can-edit-table>

      </Card>
      </Col>

    </Row>

  </div>
</template>

<script>
import axios from "axios";
import canEditTable from "../tables/components/canEditTable.vue";
import { setStore, getStore, removeStore } from "../../utils/storageUtil";
import { isIntNum, isPositiveFloat } from "../../utils/validate";
import table2excel from "@/libs/table2excel.js";
export default {
  name: "cover",
  components: { canEditTable },
  data() {
    return {
      citics1VNum: 0,
      citics2VNum: 0,
      firstProfit: "100",
      loading: false,
      stock: "",
      tableData: [],
      excelFileName: "myStock",
      csvFileName: "",
      myStocksTargetPrice: [],
      avgPos: 0,
      columnsList: [
        {
          title: "个股名称",
          key: "name",
          width: 120,
          align: "center"
        },
        {
          title: "个股代码",
          key: "code",
          width: 120,
          align: "center"
        },
        {
          title: "当前时间",
          key: "time",
          width: 160,
          align: "center"
        },
        {
          title: "现价",
          key: "price",
          width: 120,
          align: "center"
        },
        {
          title: "52周最低价",
          key: "yearLow",
          width: 120,
          align: "center"
        },
        {
          title: "止盈价",
          key: "targetPrice",
          width: 120,
          align: "center"
        },
        {
          title: "已止盈次数（默认0）",
          key: "profitTime",
          width: 120,
          align: "center",
          editable: true
        },

        {
          title: "距离止盈点百分比",
          key: "position",
          width: 120,
          align: "center",
          sortable: true,
          // sortType: "asc",
          sortMethod: function(a, b, type) {
            if (a && b) {
              const aa = parseFloat(a.replace("%"));
              const bb = parseFloat(b.replace("%"));
              if (type == "asc") {
                return aa - bb;
              } else {
                return bb - aa;
              }
            }
          }
        },
        {
          title: "操作",
          align: "center",
          width: 120,
          key: "handle",
          handle: ["delete"]
        }
      ]
    };
  },
  methods: {
    //计算首次止盈价
    calcTargetPrice(yearLow, profitTime) {
      //首次止盈50%
      if (this.firstProfit == "50") {
        if (profitTime == 0) {
          return (yearLow * 1.5).toFixed(2);
        } else {
          return (yearLow * (profitTime + 1)).toFixed(2);
        }
      }
      if (this.firstProfit == "100") {
        return (yearLow * (profitTime + 2)).toFixed(2);
      }
    },

    handleDel(val, index, delObj) {
      //删除表格后 需要把localStorage删除掉
      //let delObj = this.tableData[index];
      let delCode = delObj["code"];
      if (!delCode) {
        return;
      }
      //删除自选股
      let myStocksStore = getStore("myStocks");
      if (myStocksStore) {
        let delCodePos = myStocksStore.indexOf(delCode + ",");
        if (delCodePos >= 0) {
          setStore("myStocks", myStocksStore.replace(delCode + ",", ""));
        } else {
          delCodePos = myStocksStore.indexOf(delCode);
          if (delCodePos >= 0) {
            setStore("myStocks", myStocksStore.replace(delCode, ""));
          }
        }
      }

      //删除自选股已补仓次数
      let myStocksProfitTime = getStore("myStocksProfitTime");
      if (myStocksProfitTime) {
        let myStocksProfitTimeJson = JSON.parse(myStocksProfitTime);
        let delCoverObj = myStocksProfitTimeJson[delCode];
        if (delCoverObj >= 0) {
          delete myStocksProfitTimeJson[delCode];
          setStore(
            "myStocksProfitTime",
            JSON.stringify(myStocksProfitTimeJson)
          );
        }
      }

      console.log("handleDel");
    },
    isBelowThreshld(row, index) {
      if (row["position"]) {
        let pos = parseFloat(row["position"].replace("%"));
        if (pos <= 10) {
          return "demo-table-info-row";
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    handleTargetPriceChange(val, index, key) {
      let coverObj = this.tableData[index];

      if (!isIntNum(coverObj["profitTime"])) {
        this.$Message.error({
          content: "止盈次数格式错误"
        });
        coverObj["profitTime"] = "";
        return;
      }

      //默认止盈次数为
      if (!coverObj["profitTime"]) {
        coverObj["profitTime"] = 0;
      }

      let profitTimeInt = parseInt(coverObj["profitTime"]);
      if (profitTimeInt < 0) {
        this.$Message.error({
          content: "止盈次数格式错误"
        });
        coverObj["profitTime"] = "";
        return;
      }

      let stopProfit = this.calcTargetPrice(coverObj["yearLow"], profitTimeInt);
      coverObj["targetPrice"] = stopProfit;
      if (coverObj["price"] > 0) {
        coverObj["position"] =
          (
            (
              (coverObj["targetPrice"] - coverObj["price"]) /
              coverObj["price"]
            ).toFixed(2) * 100
          ).toFixed(0) + "%";
      }

      //存储已补仓次数
      let myStocksProfitTime = getStore("myStocksProfitTime");
      if (myStocksProfitTime) {
        let myStocksprofitTimeJson = JSON.parse(myStocksProfitTime);
        myStocksprofitTimeJson[coverObj.code] = coverObj["profitTime"];
        setStore("myStocksProfitTime", JSON.stringify(myStocksprofitTimeJson));
      } else {
        let obj = {};
        obj[coverObj.code] = coverObj["profitTime"];
        setStore("myStocksProfitTime", obj);
      }
    },
    async refreshMyStock() {
      this.loading = true;
      let myStocksStore = getStore("myStocks");
      if (!myStocksStore) {
        this.loading = false;
        return;
      }
      let retData = await this.getData(myStocksStore);
      this.tableData = retData;

      let myStocksProfitTime = getStore("myStocksProfitTime");
      //从storageClient中找出止盈次数
      let myStocksProfitTimeJson = "";
      if (myStocksProfitTime) {
        myStocksProfitTimeJson = JSON.parse(myStocksProfitTime);
      }
      this.avgPos = 0
      this.tableData.forEach(element => {
        if (myStocksProfitTimeJson && myStocksProfitTimeJson[element["code"]]) {
          element["profitTime"] = parseInt(
            myStocksProfitTimeJson[element["code"]]
          );
        } else {
          element["profitTime"] = 0;
        }
        let stopProfit = this.calcTargetPrice(
          element["yearLow"],
          element["profitTime"]
        );
        element["targetPrice"] = stopProfit;
        if (element["price"] > 0) {
          element["position"] =
            (
              (
                (element["targetPrice"] - element["price"]) /
                element["price"]
              ).toFixed(2) * 100
            ).toFixed(0) + "%";

            this.avgPos += parseInt(element["position"].replace('%',''))
        }
      });
      
      if(this.tableData.length > 0){
         this.avgPos = (this.avgPos / this.tableData.length).toFixed(2)    
      }else{
        this.avgPos = 0
      }
      

      this.loading = false;
    },
    getData(myStocksStore) {
      return Promise.all([
        axios.get(`/api/bigdata/querySinaStockGet.json?codes=${myStocksStore}`),
        axios.get(
          `/api/bigdata/queryStockYearLowPrice.json?codes=${myStocksStore}`
        )
      ]).then(values => {
        let pObj = values[0];
        let lObj = values[1];
        let c1vSet = new Set()
        let c2vSet = new Set()
        

        pObj = pObj.data;
        lObj = lObj.data;

        let lMap = {};
        let pTable = [];
        if (lObj && lObj.code == 1) {
          let lTable = lObj.data;
          for (let i = 0; i < lTable.length; i++) {
            let obj = JSON.parse(lTable[i]);
            lMap[obj["code"]] = obj["low"];
            c1vSet.add(obj['citiV1'])
            c2vSet.add(obj['citiV2'])
          }
        }
        this.citics1VNum = c1vSet.size;
        this.citics2VNum = c2vSet.size;

        if (pObj && pObj.code > 0) {
          pTable = pObj.data;
          for (let i = 0; i < pTable.length; i++) {
            let element = pTable[i];
            let code = element["code"];
            if (lMap[code]) {
              element["yearLow"] = lMap[code];

            }
          }
        }
        return pTable;
      });
    },
    changeFirstProfit() {
      this.refreshMyStock();
    },
    async addToOption() {
      if (!this.stock) {
        this.$Message.warning({
          content: "请输入股票代码，多个代码直接逗号间隔"
        });
        return;
      }
      this.stock = this.stock.replace(/，/g, ",");
      let stockArr = this.stock.split(",");
      let myStocksStore = "";
      stockArr.forEach(code => {
        if (isIntNum(code) && code.length == 6) {
          myStocksStore = getStore("myStocks");
          if (!myStocksStore) {
            myStocksStore = code;
            //持久化个人选股
            setStore("myStocks", myStocksStore);
          } else {
            if (myStocksStore.indexOf(code) < 0) {
              myStocksStore += `,${code}`;
              //持久化个人选股
              setStore("myStocks", myStocksStore);
            }
          }
        }
      });
      this.refreshMyStock();
    }
  },
  created() {
    this.$set(this, "firstProfit", "50");
    this.$set(this, "citics1VNum", 0);
    this.$set(this, "citics2VNum", 0);
    this.refreshMyStock();
  }
};
</script>
<style>
.ivu-table .demo-table-info-row td {
  background-color: #2db7f5;
  color: #fff;
}
</style>