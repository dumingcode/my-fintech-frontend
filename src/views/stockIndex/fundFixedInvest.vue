<style lang="less">
    @import '../../styles/common.less';
    @import '../tables/components/table.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24" class="padding-left-10 height-100">
                <Card>
                    <Table  border  :data="tableData"
                        :columns="columnsList"></Table>
                </Card>
            </Col>
         
        </Row>
       
    </div>
</template>

<script>

import axios from 'axios';
export default {
    name: 'dragable-table',
    components: {
        
    },
    data () {
        return {
            columnsList : [
                {
                    title: '指数名称',
                    key:'cname',
                    width: 120,
                    align: 'center'
                },
                {
                    title: 'pe',
                    key: 'pe',
                    width: 80,
                    align: 'center'
                },
                {
                    title: 'pb',
                    key: 'pb',
                    width: 80,
                    align: 'center'
                },
                {
                    title: 'pe百分位',
                    key: 'pe_pos',
                    width: 120,
                    align: 'center'
                },
                {
                    title: 'pb百分位',
                    key: 'pb_pos',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '定投倍数',
                    key: 'dtbs',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '定投基准金额',
                    key: 'baseMoney',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '本期定投金额',
                    key: 'curMoney',
                    width: 120,
                    align: 'center'
                }
            ],
            tableData: [],
            yieldCalcIndex:['000925','000922','000300'],
            pePosCalcIndex:['399812','399971','000827','000905'],
            pbPosCalcIndex:['399975','399986']
        };
    },
    methods: {
        async getIndexData(){
            let lxrIndexAllData = await axios.get('/api/indexInvest/queryLxrIndexAllData.json');
            let indexObj = JSON.parse(lxrIndexAllData.data.data)
            this.yieldCalcIndex.forEach(element => {
                let stockIndex = indexObj[element]
                stockIndex['curMoney'] = (10000 / stockIndex.pe).toFixed(0)
                stockIndex['baseMoney'] = 1000
                stockIndex['dtbs'] = 1
                stockIndex['pe'] = stockIndex['pe'].toFixed(2)
                stockIndex['pb'] = stockIndex['pb'].toFixed(2)
                stockIndex['pe_pos'] = stockIndex['pe_pos'].toFixed(2) * 100 +'%'
                stockIndex['pb_pos'] = stockIndex['pb_pos'].toFixed(2)* 100 +'%'
                this.tableData.push(stockIndex)
            });
               
    
        }
    },
     created () {
        // 可在此从服务端获取表格数据
        this.getIndexData()
    }
};
</script>
