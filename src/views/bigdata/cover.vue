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
        本页面输入的数据都存储在chrome浏览器本地存储中（服务器不会存储任何用户数据），数据无法跨PC共享。<br/>

      </Card>
      <Card>
        <Input v-model="stock" type="textarea" :rows="4" placeholder="输入实例(逗号间隔):600010,002013,002011" clearable style="width: 40%"></Input>
        <Button type="success" @click="addToOption">添加到自选</Button>
        <Button type="success" :loading="loading" @click="refreshMyStock">刷新实时价格</Button>
      </Card>

      <Card>

        <p slot="title" class="card-title">
          自选股补仓表------数量{{tableData.length}}

        </p>
        <p>
          默认补仓规则：首次建仓价每跌20%补仓。<br/>若10元建仓，则股价跌到8元、6元、4元、2元分别补仓。
        </p>
        <can-edit-table @on-delete="handleDel" refs="coverTable" :row-class-name="isBelowThreshld" @on-cell-change="handleTargetPriceChange" :editIncell="true" v-model="tableData" :columns-list="columnsList"></can-edit-table>

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
      loading: false,
      stock: "",
      tableData: [],
      excelFileName: "myStock",
      csvFileName: "",
      myStocksTargetPrice: [],
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
          title: "首次买入价",
          key: "cost",
          width: 120,
          align: "center",
          editable: true
        },
        {
          title: "已补仓次数（默认0）",
          key: "coverTime",
          width: 120,
          align: "center",
          editable: true
        },
        {
          title: "下一次补仓价",
          key: "targetPrice",
          width: 120,
          align: "center"
          // editable: true
        },
        {
          title: "距离补仓点百分比",
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
    exportExcel() {
      table2excel.transform(
        this.$refs.coverTable,
        "hrefToExportTable",
        this.excelFileName
      );
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
      let myStocksCoverTime = getStore("myStocksCoverTime");
      if (myStocksCoverTime) {
        let myStocksCoverTimeJson = JSON.parse(myStocksCoverTime);
        let delCoverObj = myStocksCoverTimeJson[delCode];
        if (delCoverObj >= 0) {
          delete myStocksCoverTimeJson[delCode];
          setStore("myStocksCoverTime", JSON.stringify(myStocksCoverTimeJson));
        }
      }

      //删除自选股成本
      let myStocksCost = getStore("myStocksCost");
      if (myStocksCost) {
        let myStocksCostJson = JSON.parse(myStocksCost);
        let delCostObj = myStocksCostJson[delCode];
        if (delCostObj) {
          delete myStocksCostJson[delCode];
          setStore("myStocksCost", JSON.stringify(myStocksCostJson));
        }
      }

      console.log("handleDel");
    },
    isBelowThreshld(row, index) {
      if (row["position"]) {
        let pos = parseFloat(row["position"].replace("%"));
        if (pos <= 5) {
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
      if (!isPositiveFloat(coverObj["cost"])) {
        this.$Message.error({
          content: "买入价格式错误"
        });
        coverObj["cost"] = "";
        return;
      }

      if (!isIntNum(coverObj["coverTime"])) {
        this.$Message.error({
          content: "补仓次数格式错误，只能输入小于5大于等于0的数字"
        });
        coverObj["coverTime"] = "";
        return;
      }

      //补仓次数为
      if (!coverObj["coverTime"]) {
        coverObj["coverTime"] = 0;
      }

      let coverTimeInt = parseInt(coverObj["coverTime"]);
      if (coverTimeInt < 0 || coverTimeInt >= 5) {
        this.$Message.error({
          content: "补仓次数格式错误，只能输入小于5大于等于0的数字"
        });
        coverObj["coverTime"] = "";
        return;
      }

      let coverBs = 1 - 0.2 * (1 + coverTimeInt);

      if (coverObj["cost"]) {
        coverObj["targetPrice"] = (
          parseFloat(coverObj["cost"]) * coverBs
        ).toFixed(2);
      }

      coverObj["position"] =
        (
          (
            (coverObj["price"] - coverObj["targetPrice"]) /
            coverObj["price"]
          ).toFixed(2) * 100
        ).toFixed(0) + "%";


      //存储成本价格键值对
      let myStocksCost = getStore("myStocksCost");
      if (myStocksCost) {
        let myStocksCostJson = JSON.parse(myStocksCost);
        myStocksCostJson[coverObj.code] = coverObj["cost"];
        setStore("myStocksCost", JSON.stringify(myStocksCostJson));
      } else {
        let obj = {};
        obj[coverObj.code] = coverObj["cost"];
        setStore("myStocksCost", obj);
      }

      //存储已补仓次数
      let myStocksCoverTime = getStore("myStocksCoverTime");
      if (myStocksCoverTime) {
        let myStocksCoverTimeJson = JSON.parse(myStocksCoverTime);
        myStocksCoverTimeJson[coverObj.code] = coverObj["coverTime"];
        setStore("myStocksCoverTime", JSON.stringify(myStocksCoverTimeJson));
      } else {
        let obj = {};
        obj[coverObj.code] = coverObj["coverTime"];
        setStore("myStocksCoverTime", obj);
      }
    },
    async refreshMyStock() {
      this.loading = true;
      let myStocksStore = getStore("myStocks");
      if (!myStocksStore) {
        this.loading = false;
        return;
      }
      let retData = await axios.get(
        `/api/bigdata/querySinaStockGet.json?codes=${myStocksStore}`
      );
      if (retData.code <= 0) {
        this.$Message.error({
          content: "刷新失败"
        });
        this.loading = false;
        return;
      }

      this.tableData = retData.data["data"];

      let myStocksCost = getStore("myStocksCost");
      //从storageClient中找出成本价键值对
      if (myStocksCost) {
        let myStocksJson = JSON.parse(myStocksCost);
        this.tableData.forEach(element => {
          if (myStocksJson[element["code"]]) {
            element["cost"] = myStocksJson[element["code"]];
          }
        });
      }

      let myStocksCoverTime = getStore("myStocksCoverTime");
      //从storageClient中找出成本价键值对
      if (myStocksCoverTime) {
        let myStocksCoverTimeJson = JSON.parse(myStocksCoverTime);
        this.tableData.forEach(element => {
          if (myStocksCoverTimeJson[element["code"]]) {
            element["coverTime"] = parseInt(myStocksCoverTimeJson[element["code"]]);
          } else {
            element["coverTime"] = 0;
          }
          let coverBs = 1 - 0.2 * (1 + element["coverTime"]);

          if (element["cost"] && element["price"] >0) {
            element["targetPrice"] = (
              parseFloat(element["cost"]) * coverBs
            ).toFixed(2);
            element["position"] =
              (
                (
                  (element["price"] - element["targetPrice"]) /
                  element["price"]
                ).toFixed(2) * 100
              ).toFixed(0) + "%";
          }
        });
      }

      this.loading = false;
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