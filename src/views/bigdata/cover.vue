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
          输入首次买入价，若补仓价为空，则补仓价为首次买入价格的80%。<br/> 若补仓价不为空，则改变首次买入价不会对补仓价造成影响。
          <br/> 多次补仓或者自定义补仓规则请直接修改补仓价，忽略首次买入价。
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
      selectMinRow: 1,
      selectMinCol: 1,
      maxRow: 0,
      minRow: 1,
      maxCol: 0,
      minCol: 1,
      csvFileName: "",
      fontSize: 16,
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
          title: "补仓价",
          key: "targetPrice",
          width: 120,
          align: "center",
          editable: true
        },
        {
          title: "距离补仓点百分比",
          key: "position",
          width: 120,
          align: "center",
          sortable: true,
          sortType: 'asc',
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
      if (!myStocksStore) {
        return;
      }
      let delCodePos = myStocksStore.indexOf(delCode + ",");
      if (delCodePos >= 0) {
        setStore("myStocks", myStocksStore.replace(delCode + ",", ""));
      } else {
        delCodePos = myStocksStore.indexOf(delCode);
        if (delCodePos >= 0) {
          setStore("myStocks", myStocksStore.replace(delCode, ""));
        }
      }
      //删除自选股目标值
      let myStocksTarget = getStore("myStocksTarget");
      if (!myStocksTarget) {
        return;
      }
      let myStocksJson = JSON.parse(myStocksTarget);
      let delTargetObj = myStocksJson[delCode];
      if (!delTargetObj) {
        return;
      }
      delete myStocksJson[delCode];
      setStore("myStocksTarget", JSON.stringify(myStocksJson));

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
      if (!isPositiveFloat(coverObj["targetPrice"])) {
        this.$Message.error({
          content: "补仓价格式错误"
        });
        coverObj["targetPrice"] = "";
        return;
      }

      //输入买入价格后，如果补仓价格为空则自动算出来第一次补仓价格
      if (coverObj["cost"] && !coverObj["targetPrice"]) {
        coverObj["targetPrice"] = (parseFloat(coverObj["cost"]) * 0.8).toFixed(
          2
        );
      }

      coverObj["position"] =
        (
          (
            (coverObj["price"] - coverObj["targetPrice"]) /
            coverObj["targetPrice"]
          ).toFixed(2) * 100
        ).toFixed(0) + "%";

      console.log(coverObj);

      //存储目标值键值对
      let myStocksTarget = getStore("myStocksTarget");
      if (myStocksTarget) {
        let myStocksJson = JSON.parse(myStocksTarget);
        myStocksJson[coverObj.code] = coverObj["targetPrice"];
        setStore("myStocksTarget", JSON.stringify(myStocksJson));
      } else {
        let obj = {};
        obj[coverObj.code] = coverObj["targetPrice"];
        setStore("myStocksTarget", obj);
      }

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
    },
    async initMyStock() {
      let myStocksStore = getStore("myStocks");
      if (!myStocksStore) {
        return;
      }
      let retData = await axios.get(
        `/api/bigdata/querySinaStockGet.json?codes=${myStocksStore}`
      );
      if (retData.code <= 0) {
        this.$Message.error({
          content: `添加失败，错误原因：${retData.msg}`
        });
        return;
      }

      this.tableData = retData.data["data"];
      let myStocksTarget = getStore("myStocksTarget");
      //从storageClient中找出目标值键值对
      if (myStocksTarget) {
        let myStocksJson = JSON.parse(myStocksTarget);
        this.tableData.forEach(element => {
          if (myStocksJson[element["code"]]) {
            element["targetPrice"] = myStocksJson[element["code"]];
            element["position"] =
              (
                (
                  (element["price"] - element["targetPrice"]) /
                  element["targetPrice"]
                ).toFixed(2) * 100
              ).toFixed(0) + "%";
          }
        });
      }
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
      let myStocksTarget = getStore("myStocksTarget");
      //从storageClient中找出目标值键值对
      if (myStocksTarget) {
        let myStocksJson = JSON.parse(myStocksTarget);
        this.tableData.forEach(element => {
          if (myStocksJson[element["code"]]) {
            element["targetPrice"] = myStocksJson[element["code"]];
            element["position"] =
              (
                (
                  (element["price"] - element["targetPrice"]) /
                  element["targetPrice"]
                ).toFixed(2) * 100
              ).toFixed(0) + "%";
          }
        });
      }
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

      let retData = await axios.get(
        `/api/bigdata/querySinaStockGet.json?codes=${myStocksStore}`
      );
      if (retData.code <= 0) {
        this.$Message.error({
          content: `添加失败，错误原因：${retData.msg}`
        });
        return;
      }

      this.tableData = retData.data["data"];
      this.refreshMyStock();
    }
  },
  created() {
    this.initMyStock();
  }
};
</script>
<style>
.ivu-table .demo-table-info-row td {
  background-color: #2db7f5;
  color: #fff;
}
</style>