<style lang="less">
@import "../../styles/common.less";
@import "../../views/tables/components/table.less";
</style>

<template>
  <div>
    <Row>
      <Col span="24" class="padding-left-10 height-100">
      <Card>
        <p slot="title" class="card-title">网格行情刷新</p>
        本页面输入的数据都存储在chrome浏览器本地存储中（服务器不会存储任何用户数据），数据无法跨PC共享。<br/>

      </Card>
      
      <Card>
        <Button type="success" :loading="loading" @click="refreshMyStock">刷新实时价格</Button>
      </Card>

      <Card>
        <can-edit-table  :row-class-name="isBelowThreshld"   @on-cell-change="handleTargetPriceChange" :editIncell="true" v-model="tableData" :columns-list="columnsList"></can-edit-table>
      </Card>
      </Col>

    </Row>

  </div>
</template>

<script>
import axios from "axios";
import { setStore, getStore, removeStore } from "@/utils/storageUtil"
import { isIntNum, isPositiveFloat } from "@/utils/validate"
import table2excel from "@/libs/table2excel.js"
import canEditTable from "@/views/tables/components/canEditTable.vue"
export default {
  name: "indexGrid",
  components: { canEditTable },
  data() {
    return {
      loading: false,
      stock: "",
      tableData: [],
      gridIndex: '399905,399975,162411',
      columnsList: [
        {
          title: "名称",
          key: "name",
          width: 120,
          align: "center"
        },
        {
          title: "代码",
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
          title: "实时行情",
          key: "price",
          width: 120,
          align: "center"
        },
        {
          title: "当前网格位置",
          key: "curLevel",
          width: 120,
          align: "center",
          editable: true
        },
        {
          title: "网格间距(%)",
          key: "gap",
          width: 120,
          align: "center",
          editable: true
        },
        {
          title: "下格买入位置",
          key: "buyGrid",
          width: 120,
          align: "center"
        },
        {
          title: "本格卖出位置",
          key: "sellGrid",
          width: 120,
          align: "center"
        }
      ]
    };
  },
  methods: {
    isBelowThreshld(row, index) {
      if (row['price'] && row['curLevel'] && row['gap']) {
        let gap = parseFloat(row['gap']) / 100
        let curLevel = parseFloat(row['curLevel'])
        let price = parseFloat(row['price'])
        // 买入
        if (price <= curLevel * (1 - gap)) {
          return 'demo-table-info-row-cell';
        } else if (price >= curLevel * (1 + gap)) {
          // 卖出
          return 'demo-table-info-row-cell-expensive'
        } 
      }
      return ''
    },
    handleTargetPriceChange(val, index, key) {
      let coverObj = this.tableData[index];
      if (!isPositiveFloat(coverObj["curLevel"])) {
        this.$Message.error({
          content: "当前网格位置设置错误"
        });
        coverObj["curLevel"] = '';
        return;
      }

      if (!isIntNum(coverObj["gap"])) {
        this.$Message.error({
          content: "网格间距错误，请输入正整数"
        });
        coverObj["gap"] = '';
        return;
      }

    
     if(coverObj["gap"]){
        //存储已补仓次数
        let myGridGap = getStore("myGridGap");
        if (myGridGap) {
          let myGridGapJson = JSON.parse(myGridGap);
          myGridGapJson[coverObj.code] = (parseFloat(coverObj["gap"])).toFixed(2)
          setStore("myGridGap", JSON.stringify(myGridGapJson));
        } else {
          let obj = {};
          obj[coverObj.code] = coverObj["gap"];
          setStore("myGridGap", obj);
        }


      }

      
      if(coverObj["curLevel"]){
  //存储成本价格键值对
        let myGridCurLevel = getStore("myGridCurLevel");
        if (myGridCurLevel) {
          let myGridCurLevelJson = JSON.parse(myGridCurLevel);
          myGridCurLevelJson[coverObj.code] = (parseFloat(coverObj["curLevel"])).toFixed(2)
          setStore("myGridCurLevel", JSON.stringify(myGridCurLevelJson));
        } else {
          let obj = {};
          obj[coverObj.code] = coverObj["curLevel"];
          setStore("myGridCurLevel", obj);
        }

      }
     

      if (coverObj['curLevel'] && coverObj['gap'] ) {
        coverObj["buyGrid"] = parseFloat(
          parseFloat(coverObj["curLevel"]) * (1 - parseFloat(coverObj["gap"])/100)
        ).toFixed(2)
        coverObj["sellGrid"] = parseFloat(
          parseFloat(coverObj["curLevel"]) * (1 + parseFloat(coverObj["gap"])/100)
        ).toFixed(2)
      }

      
    },
    async refreshMyStock() {
      this.loading = true;
      let retData = await axios.get(
        `/api/bigdata/querySinaStockGet.json?codes=${this.gridIndex}`
      );
      if (retData.code <= 0) {
        this.$Message.error({
          content: "刷新失败"
        });
        this.loading = false;
        return;
      }

      this.tableData = retData.data["data"];

      let myGridCurLevel = getStore("myGridCurLevel");
      //从storageClient中找出设定的当前网格位置
      if (myGridCurLevel) {
        let myGridCurLevelJson = JSON.parse(myGridCurLevel);
        this.tableData.forEach(element => {
          if (myGridCurLevelJson[element["code"]]) {
            element["curLevel"] = parseFloat( myGridCurLevelJson[element["code"]]).toFixed(2)
          }else{
             element["curLevel"] = ''
          }
        });
      }

      let myGridGap = getStore("myGridGap");
      //从storageClient中找出成本价键值对
      if (myGridGap) {
        let myGridGapJson = JSON.parse(myGridGap);
        this.tableData.forEach(element => {
          if (myGridGapJson[element["code"]]) {
            element["gap"] = parseInt(myGridGapJson[element["code"]]);
          }else {
            element["gap"] = ''
          }

          if (element["curLevel"] && element["gap"]) {
            element["buyGrid"] = 
              (parseFloat(element["curLevel"]) * (1 - parseFloat(element["gap"])/100)).toFixed(2)
            element["sellGrid"] = 
              (parseFloat(element["curLevel"]) * (1 + parseFloat(element["gap"])/100)).toFixed(2)
          }
        });
      }

      this.loading = false;
    }
  },
  created() {
    this.refreshMyStock();
  }
};
</script>
<style>
.ivu-table .demo-table-info-row-cell td  {
        background-color: #2db7f5;
        color: #fff;
  }

  .ivu-table .demo-table-info-row-cell-expensive  td {
        background-color: #e08a18;
        color: #fff;
    }
</style>