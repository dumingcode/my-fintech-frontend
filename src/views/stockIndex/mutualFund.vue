<style lang="less" scoped>
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row>
            <Card>
                <h4 slot="title">
                    <Icon type="android-archive"></Icon>
                    场外指数基金
                </h4>

                <Row class="margin-top-10">
                    <Card>
                        <h4 slot="title">
                            <Icon type="android-archive"></Icon>
                            2018年第一季度
                        </h4>
                        <Row>
                            <Col span="18">
                            <Table :columns="excelColumns" height="990px" :data="table2excelData" size="small" ref="tableExcel"></Table>
                            </Col>
                            <Col span='6' class="padding-left-10">
                            <div class="margin-top-10 margin-left-10">
                                <span>输入文件名：</span>
                                <Input v-model="excelFileName" icon="document" placeholder="请输入文件名" style="width: 190px" />
                            </div>
                            <div class="margin-left-10 margin-top-20">
                                <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
                                <Button type="primary" size="large" @click="exportExcel">下载表格数据</Button>
                            </div>
                            </Col>
                        </Row>
                    </Card>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
    import { mutualFundData, mutualFundColumns } from './data/stockIndex.js';
    import table2excel from '@/libs/table2excel.js';
    export default {
        name: 'exportable-table',
        data() {
            return {
                table2excelData: mutualFundData,
                excelColumns: mutualFundColumns,
                selectMinRow: 1,
                selectMinCol: 1,
                maxRow: 0,
                minRow: 1,
                maxCol: 0,
                minCol: 1,
                csvFileName: '',
                excelFileName: '',
                tableExcel: {},
                fontSize: 16
            };
        },
        methods: {
            exportExcel() {
                table2excel.transform(this.$refs.tableExcel, 'hrefToExportTable', this.excelFileName);
            }
        }
    };
</script>