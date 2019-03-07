<style lang="less">
@import "../../styles/common.less";
@import "../../views/tables/components/table.less";
</style>

<template>
  <div>
    <Row>
      <Col span="24" class="padding-left-10 height-100">
      <Card>
        <p slot="title" class="card-title">转债止盈查询</p>
        本页面输入的数据都存储在chrome浏览器本地存储中（服务器不会存储任何用户数据），数据无法跨PC共享。<br/>

      </Card>
      <Card>
        <Input v-model="stock" type="textarea" :rows="4" placeholder="输入实例(逗号间隔):110050,002013,002011" clearable style="width: 40%"></Input>
        <Button type="success" @click="addToOption">添加到自选</Button>
        <Button type="success" :loading="loading" @click="refreshMyStock">刷新实时价格</Button>
      </Card>
    <Card>
        <span style="font-weight:bold">止盈趋势线选择</span>
        <Select v-model="firstProfit" style="width:200px" @on-change="changeFirstProfit">
          <Option value="5" key="5">ma5</Option>
          <Option value="10" key="10">ma10</Option>
          <Option value="20" key="20">ma20</Option>
        </Select>
        <span>
          止盈规则：130元以上，转债价格跌破趋势线止盈。
        </span>
      </Card>
      
      <Card>
        <can-edit-table @on-delete="handleDel" refs="profitTable" :row-class-name="isBelowThreshld"  :editIncell="true" v-model="tableData" :columns-list="columnsList"></can-edit-table>

      </Card>
      </Col>

    </Row>

  </div>
</template>

<script>
import axios from "axios";
import canEditTable from "@/views/tables/components/canEditTable.vue";
import { setStore, getStore, removeStore } from "@/utils/storageUtil";
import { isIntNum, isPositiveFloat } from "@/utils/validate";
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
      firstProfit: "10",
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
          align: "center",
          sortable: true,
          // sortType: "asc",
          sortMethod: function(a, b, type) {
            if (a && b) {
              const aa = parseFloat(a)
              const bb = parseFloat(b)
              if (type == "asc") {
                return aa - bb;
              } else {
                return bb - aa;
              }
            }
          }
        },
        {
          title: "ma5",
          key: "ma5",
          width: 80,
          align: "center"
        },
        {
          title: "ma10",
          key: "ma10",
          width: 80,
          align: "center"
        },
        {
          title: "ma20",
          key: "ma20",
          width: 80,
          align: "center"
        },
        {
          title: "ma更新时间",
          key: "uptTime",
          width: 160,
          align: "center"
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
      let myStocksStore = getStore("myCbonds");
      if (myStocksStore) {
        let delCodePos = myStocksStore.indexOf(delCode + ",");
        if (delCodePos >= 0) {
          setStore("myCbonds", myStocksStore.replace(delCode + ",", ""));
        } else {
          delCodePos = myStocksStore.indexOf(delCode);
          if (delCodePos >= 0) {
            setStore("myCbonds", myStocksStore.replace(delCode, ""));
          }
        }
      }

     

      console.log("handleDel");
    },
     changeFirstProfit() {
      this.refreshMyStock();
    },
    // 当前价格大于130 且 低于ma20
    isBelowThreshld(row, index) {
      if (row["price"]) {
        let pos = parseFloat(row["price"])
        if (pos <= this.firstProfit) {
          return "demo-table-info-row";
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    async refreshMyStock() {
      this.loading = true;
      let myStocksStore = getStore("myCbonds");
      if (!myStocksStore) {
        this.loading = false;
        return;
      }
      let retData = await this.getData(myStocksStore);
      this.tableData = retData;
      this.loading = false;
    },
    getData(myStocksStore) {
      return Promise.all([
        axios.get(`/api/bigdata/querySinaStockGet.json?codes=${myStocksStore}`),
        axios.get(
          `/api/cBond/queryCbondMa.json?codes=${myStocksStore}`
        )
      ]).then(values => {
        let pObj = values[0];
        let lObj = values[1];
     
        let c1vSet = new Set()
        let c2vSet = new Set()
        

        pObj = pObj.data; //新浪实时股价
        lObj = lObj.data; //ma20

        let lMap = {};
        let pTable = [];
        if (lObj && lObj.code == 1) {
          let lTable = lObj.data;
          for (let i = 0; i < lTable.length; i++) {
            let obj = JSON.parse(lTable[i]);
            lMap[obj["code"]+'ma20'] = obj['ma20']
            lMap[obj["code"]+'ma10'] = obj['ma10']
            lMap[obj["code"]+'ma5'] = obj['ma5']
            lMap[obj["code"]+'ma20GenDate'] = obj['ma20GenDate']
             lMap[obj["code"]] = obj['code']
          }
        }

        if (pObj && pObj.code > 0) {
          pTable = pObj.data;
          for (let i = 0; i < pTable.length; i++) {
            let element = pTable[i];
            let code = element["code"];
            if (lMap[code]) {
              element["ma20"] = lMap[code+'ma20']
              element["ma10"] = lMap[code+'ma10']
              element["ma5"] = lMap[code+'ma5']
              element["uptTime"] = lMap[code+'ma20GenDate']

            }
          }
        }
        return pTable;
      });
    },
    
    async addToOption() {
      if (!this.stock) {
        this.$Message.warning({
          content: "请输入可转债代码，多个代码直接逗号间隔"
        });
        return;
      }
      this.stock = this.stock.replace(/，/g, ",");
      let stockArr = this.stock.split(",");
      let myStocksStore = "";
      stockArr.forEach(code => {
        if (isIntNum(code) && code.length == 6) {
          myStocksStore = getStore("myCbonds");
          if (!myStocksStore) {
            myStocksStore = code;
            //持久化个人选股
            setStore("myCbonds", myStocksStore);
          } else {
            if (myStocksStore.indexOf(code) < 0) {
              myStocksStore += `,${code}`;
              //持久化个人选股
              setStore("myCbonds", myStocksStore);
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