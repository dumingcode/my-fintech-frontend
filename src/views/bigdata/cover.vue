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
        <Button type="info" @click="addToOption">添加到自选</Button>
      </Card>

      <Card>
        <p slot="title" class="card-title">
          自选股补仓表
        </p>
        <can-edit-table refs="coverTable" @on-cell-change="handleTargetPriceChange" :editIncell="true" v-model="tableData" :columns-list="columnsList"></can-edit-table>
      </Card>
      </Col>

    </Row>

  </div>
</template>

<script>
import axios from "axios";
import collect from "collect";
import canEditTable from "../tables/components/canEditTable.vue";
import { setStore, getStore, removeStore } from "../../utils/storageUtil";
import { isIntNum } from "../../utils/validate";
export default {
  name: "cover",
  components: { canEditTable },
  data() {
    return {
      stock: "",
      tableData: [],
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
          title: "目标价",
          key: "targetPrice",
          width: 120,
          align: "center",
          editable: true
        },
        {
          title: "距离补仓点百分比",
          key: "position",
          width: 120,
          align: "center"
        }
      ]
    };
  },
  methods: {
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
    async addToOption() {
      if (!this.stock) {
        this.$Message.warning({ content: "请输入股票代码" });
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
          } else {
            if (myStocksStore.indexOf(code) < 0) {
              myStocksStore += `,${code}`;
            }
          }
        }
      });
      //持久化个人选股
      setStore("myStocks", myStocksStore);

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