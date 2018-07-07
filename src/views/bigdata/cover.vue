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
        <Input v-model="stock" type="textarea" :rows="4" placeholder="输入实例(逗号间隔):600010,002013,002011" clearable style="width: 40%"></Input>
        <Button type="success" @click="addToOption">添加到自选</Button>
        <Button type="success" :loading="loading" @click="refreshMyStock">刷新实时价格</Button>
      </Card>

      <Card>

        <p slot="title" class="card-title">
          自选股补仓表------数量{{tableData.length}}
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
import { isIntNum } from "../../utils/validate";
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
          sortType: 'desc',
          sortMethod: function(a, b, type) {
            if (a && b) {
              const aa = parseFloat(a.replace("%"));
              const bb = parseFloat(b.replace("%"));
              if (type == "asc") {
                return aa < bb;
              } else {
                return aa >= bb;
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
      if (coverObj["targetPrice"] <= 0) {
        this.$Message.error({
          content: "目标值不能小于等于0"
        });
        return;
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